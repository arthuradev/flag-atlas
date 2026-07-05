import type { IconName } from "@/shared/components/Icon";

/**
 * Mascotes cosméticos (Versão 4). Discretos e opcionais: aparecem em cantos de
 * apoio (Home, resumo de sessão, conquistas), nunca sobre a bandeira nem
 * atrapalhando o treino. "Nenhum" é o padrão. Agora representados por ícones
 * próprios do sistema (<Icon>), sem depender de emoji nem de CDN.
 */
export const MASCOT_ICON: Record<string, IconName | null> = {
  "mascot-none": null,
  "mascot-globe": "globe",
  "mascot-compass": "compass",
  "mascot-owl": "owl",
  "mascot-rocket": "rocket",
};

/** Ícone do mascote equipado, ou null quando é "nenhum"/desconhecido. */
export function mascotIcon(mascotId: string): IconName | null {
  return MASCOT_ICON[mascotId] ?? null;
}
