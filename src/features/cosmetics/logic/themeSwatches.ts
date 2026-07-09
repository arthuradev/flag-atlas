/**
 * Amostras de cor por tema para o preview da Loja (fundo, primária, acento).
 * Só apresentação: a paleta real vive nos blocos [data-theme] do index.css.
 */
export const THEME_SWATCHES: Record<string, [string, string, string]> = {
  "theme-default": ["#EAF2F8", "#0C97AD", "#F5A836"],
  "theme-flaggo-light": ["#EAF2F8", "#0C97AD", "#F5A836"],
  "theme-flaggo-night": ["#0A1E33", "#12C2D6", "#FFC24B"],
  "theme-mapa-antigo": ["#EFE6D2", "#9A6B3F", "#B8863B"],
  "theme-neon": ["#241227", "#FF8E53", "#FFC24B"],
  "theme-oceano": ["#06283D", "#2EC7C7", "#38BDF8"],
  "theme-espaco": ["#0B1030", "#4FD8C6", "#A78BFA"],
  "theme-biblioteca": ["#ECE3D4", "#7A5230", "#A97B45"],
  "theme-minimalista": ["#F6F6F7", "#2B2B2B", "#4B4B4B"],
};

const DEFAULT_SWATCH: [string, string, string] = ["#EAF2F8", "#0C97AD", "#F5A836"];

export function themeSwatch(themeId: string): [string, string, string] {
  return THEME_SWATCHES[themeId] ?? DEFAULT_SWATCH;
}
