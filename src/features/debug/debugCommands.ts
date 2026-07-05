/**
 * ATENÇÃO: FERRAMENTA DE TESTE TEMPORÁRIA (Versão 4). Um pequeno console de debug
 * para o desenvolvedor conceder moedas/XP e liberar cosméticos ao testar o
 * próprio jogo. NÃO é parte do produto e deve ser removido depois: basta
 * apagar a pasta `src/features/debug/` e a linha `<DebugConsole />` em App.tsx.
 *
 * As moedas/XP são cosméticas e locais (sem valor real, sem backend), então
 * este console não dá vantagem real — só facilita testar as telas.
 */

import { COSMETIC_CATALOG } from "@/entities/cosmetic/cosmetic.catalog";
import { equipCosmetic, getCosmeticById } from "@/entities/cosmetic/cosmetic.selectors";
import type { UserProgress } from "@/entities/progress/progress.types";
import { computeLevel } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { saveProgress } from "@/shared/storage/progressRepository";

export const DEBUG_HELP: readonly string[] = [
  "Comandos disponíveis:",
  "  help                 mostra esta ajuda",
  "  status               mostra moedas, XP, nível e itens",
  "  coins <n>            soma n moedas (n pode ser negativo)",
  "  setcoins <n>         define o total de moedas",
  "  xp <n>               soma n de XP (recalcula o nível)",
  "  setxp <n>            define o total de XP",
  "  unlock <id>          libera um cosmético (sem pagar)",
  "  unlockall            libera todos os cosméticos",
  "  equip <id>           equipa um cosmético (libera se preciso)",
  "  session <n>          soma n a sessões concluídas",
  "  list [tipo]          lista ids do catálogo (opcional por tipo)",
  "  reset                zera todo o progresso",
  "  clear                limpa a saída do console",
  "  close                fecha o console",
];

/** Aplica uma mutação imutável ao progresso e persiste (como o store faz). */
function mutate(recipe: (progress: UserProgress) => UserProgress): UserProgress {
  const next = recipe(useProgressStore.getState().progress);
  useProgressStore.setState({ progress: next });
  saveProgress(next);
  return next;
}

function toInt(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function safe(value: number): number {
  return Math.max(0, value);
}

/**
 * Executa um comando de debug e devolve as linhas de saída.
 * `clear`/`close` são tratados pela UI (devolvem um marcador).
 */
export function runDebugCommand(raw: string): string[] {
  const parts = raw.trim().split(/\s+/);
  const cmd = (parts[0] ?? "").toLowerCase();
  const arg = parts[1];

  switch (cmd) {
    case "":
      return [];

    case "help":
      return [...DEBUG_HELP];

    case "status": {
      const p = useProgressStore.getState().progress;
      const owned = p.cosmetics.ownedItemIds.length;
      return [
        `Moedas: ${p.cosmetics.coins}`,
        `XP: ${p.totalXp} (nível ${p.level})`,
        `Sessões concluídas: ${p.completedSessions}`,
        `Cosméticos comprados: ${owned}/${COSMETIC_CATALOG.length}`,
      ];
    }

    case "coins": {
      const n = toInt(arg);
      if (n === null) {
        return ["Uso: coins <n>"];
      }
      const p = mutate((pr) => ({
        ...pr,
        cosmetics: { ...pr.cosmetics, coins: safe(pr.cosmetics.coins + n) },
      }));
      return [`Moedas: ${p.cosmetics.coins}`];
    }

    case "setcoins": {
      const n = toInt(arg);
      if (n === null) {
        return ["Uso: setcoins <n>"];
      }
      const p = mutate((pr) => ({
        ...pr,
        cosmetics: { ...pr.cosmetics, coins: safe(n) },
      }));
      return [`Moedas: ${p.cosmetics.coins}`];
    }

    case "xp": {
      const n = toInt(arg);
      if (n === null) {
        return ["Uso: xp <n>"];
      }
      const p = mutate((pr) => {
        const totalXp = safe(pr.totalXp + n);
        return { ...pr, totalXp, level: computeLevel(totalXp) };
      });
      return [`XP: ${p.totalXp} (nível ${p.level})`];
    }

    case "setxp": {
      const n = toInt(arg);
      if (n === null) {
        return ["Uso: setxp <n>"];
      }
      const p = mutate((pr) => {
        const totalXp = safe(n);
        return { ...pr, totalXp, level: computeLevel(totalXp) };
      });
      return [`XP: ${p.totalXp} (nível ${p.level})`];
    }

    case "unlock":
    case "give": {
      if (!arg) {
        return ["Uso: unlock <id>"];
      }
      if (!getCosmeticById(arg)) {
        return [`Item desconhecido: ${arg}`];
      }
      mutate((pr) =>
        pr.cosmetics.ownedItemIds.includes(arg)
          ? pr
          : {
              ...pr,
              cosmetics: {
                ...pr.cosmetics,
                ownedItemIds: [...pr.cosmetics.ownedItemIds, arg],
              },
            },
      );
      return [`Item liberado: ${arg}`];
    }

    case "unlockall": {
      const ids = COSMETIC_CATALOG.map((item) => item.id);
      mutate((pr) => ({ ...pr, cosmetics: { ...pr.cosmetics, ownedItemIds: ids } }));
      return [`Todos os ${ids.length} cosméticos liberados.`];
    }

    case "equip": {
      if (!arg) {
        return ["Uso: equip <id>"];
      }
      const item = getCosmeticById(arg);
      if (!item) {
        return [`Item desconhecido: ${arg}`];
      }
      mutate((pr) => {
        const withOwnership = pr.cosmetics.ownedItemIds.includes(arg)
          ? pr.cosmetics
          : { ...pr.cosmetics, ownedItemIds: [...pr.cosmetics.ownedItemIds, arg] };
        return { ...pr, cosmetics: equipCosmetic(withOwnership, arg) };
      });
      return [`Equipado: ${arg}`];
    }

    case "session": {
      const n = toInt(arg) ?? 1;
      const p = mutate((pr) => ({
        ...pr,
        completedSessions: safe(pr.completedSessions + n),
      }));
      return [`Sessões concluídas: ${p.completedSessions}`];
    }

    case "list": {
      const filtered = arg
        ? COSMETIC_CATALOG.filter((item) => item.type === arg)
        : COSMETIC_CATALOG;
      if (filtered.length === 0) {
        return [`Nenhum item para o tipo: ${arg}`];
      }
      return filtered.map((item) => `${item.id} — ${item.type} (${item.price})`);
    }

    case "reset": {
      useProgressStore.getState().resetProgress();
      return ["Progresso resetado."];
    }

    case "clear":
      return ["__clear__"];

    case "close":
      return ["__close__"];

    default:
      return [`Comando desconhecido: ${cmd}. Digite "help".`];
  }
}
