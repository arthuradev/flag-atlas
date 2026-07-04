/**
 * Efeitos visuais cosméticos sutis (Versão 4). Aparecem em momentos de feedback
 * (acerto, fim de sessão, conquista, compra). São leves — sem canvas pesado nem
 * partículas caras — e SEMPRE respeitam reduced motion: com movimento reduzido
 * os efeitos são desativados. Efeitos desconhecidos caem em "nenhum".
 */
export const VISUAL_EFFECT_KINDS = ["none", "glow", "confetti", "neonPulse", "stars"] as const;

export type VisualEffectKind = (typeof VISUAL_EFFECT_KINDS)[number];

const KIND_BY_ID: Record<string, VisualEffectKind> = {
  "effect-none": "none",
  "effect-glow": "glow",
  "effect-confetti": "confetti",
  "effect-neon-pulse": "neonPulse",
  "effect-stars": "stars",
};

/**
 * Efeito a exibir dado o item equipado e a preferência de movimento.
 * Reduced motion desativa o efeito; item inválido vira "none".
 */
export function resolveVisualEffectKind(effectId: string, reduceMotion: boolean): VisualEffectKind {
  if (reduceMotion) {
    return "none";
  }
  return KIND_BY_ID[effectId] ?? "none";
}
