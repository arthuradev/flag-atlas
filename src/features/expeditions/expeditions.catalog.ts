import type { SessionConfig } from "@/entities/session/session.types";
import type { IconName } from "@/shared/components/Icon";

/**
 * Expedições — pacotes temáticos fora da jornada principal.
 *
 * Nesta versão são uma área visual/estrutural: o catálogo modela status,
 * dificuldade e recompensa planejada, mas só expedições com `session`
 * definida são jogáveis hoje (reutilizando o pipeline de sessões existente).
 * Sem compras reais e fora da Loja, por decisão de produto.
 */

export const EXPEDITION_STATUSES = [
  "available",
  "inProgress",
  "locked",
  "completed",
  "premium",
] as const;

export type ExpeditionStatus = (typeof EXPEDITION_STATUSES)[number];

export type ExpeditionDifficulty = "easy" | "medium" | "hard";

export type ExpeditionDefinition = {
  /** Base das chaves i18n: expeditions.items.<id>.title/.description */
  id: string;
  icon: IconName;
  difficulty: ExpeditionDifficulty;
  /** Recompensa planejada em XP, exibida no card. */
  xpReward: number;
  status: ExpeditionStatus;
  /** Config de sessão quando a expedição já é jogável com o engine atual. */
  session?: SessionConfig;
  /** Destaque da página. */
  featured?: boolean;
};

export const EXPEDITIONS: readonly ExpeditionDefinition[] = [
  {
    id: "similar-flags",
    icon: "layers",
    difficulty: "medium",
    xpReward: 80,
    status: "available",
    featured: true,
    session: { mode: "similar", questionType: "choice", size: 10 },
  },
  {
    id: "world-cup",
    icon: "trophy",
    difficulty: "medium",
    xpReward: 100,
    status: "locked",
  },
  {
    id: "microstates",
    icon: "gem",
    difficulty: "medium",
    xpReward: 60,
    status: "locked",
  },
  {
    id: "pacific-islands",
    icon: "waves",
    difficulty: "medium",
    xpReward: 70,
    status: "locked",
  },
  {
    id: "historic-europe",
    icon: "book",
    difficulty: "easy",
    xpReward: 50,
    status: "locked",
  },
  {
    id: "world-capitals",
    icon: "globe",
    difficulty: "hard",
    xpReward: 100,
    status: "premium",
  },
];

export function getFeaturedExpedition(): ExpeditionDefinition {
  const featured = EXPEDITIONS.find((expedition) => expedition.featured) ?? EXPEDITIONS[0];
  if (!featured) {
    // Inalcançável: o catálogo é estático e nunca vazio.
    throw new Error("Expedition catalog is empty");
  }
  return featured;
}
