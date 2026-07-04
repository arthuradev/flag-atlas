/**
 * Mascotes cosméticos (Versão 4). Discretos e opcionais: aparecem em cantos de
 * apoio (Home, resumo de sessão, conquistas), nunca sobre a bandeira nem
 * atrapalhando o treino. "Nenhum" é o padrão. Assets locais (emoji), sem CDN.
 */
export const MASCOT_EMOJI: Record<string, string | null> = {
  "mascot-none": null,
  "mascot-globe": "🌍",
  "mascot-compass": "🧭",
  "mascot-owl": "🦉",
  "mascot-rocket": "🚀",
};

/** Emoji do mascote equipado, ou null quando é "nenhum"/desconhecido. */
export function mascotEmoji(mascotId: string): string | null {
  return MASCOT_EMOJI[mascotId] ?? null;
}
