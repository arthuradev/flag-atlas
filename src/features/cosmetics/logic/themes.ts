import type { ThemePreference } from "@/entities/settings/settings.types";

/**
 * Resolução do tema visual aplicado ao <html data-theme>.
 *
 * O tema "padrão" (theme-default) segue a preferência claro/escuro/sistema das
 * Configurações — nada muda para quem já usava o app. Os temas cosméticos
 * especiais definem sua própria paleta e ignoram claro/escuro (têm um único
 * visual). Temas desconhecidos caem no padrão com segurança.
 */

/**
 * Valor de data-theme (CSS) para cada tema cosmético especial.
 * Ids legados mantidos por compatibilidade de inventário; o nome visível
 * mudou no rebrand (theme-neon virou "Sunset", theme-espaco virou "Aurora",
 * theme-mapa-antigo virou "Cartógrafo").
 */
export const SPECIAL_THEME_DATA: Record<string, string> = {
  "theme-flaggo-light": "light",
  "theme-flaggo-night": "dark",
  "theme-mapa-antigo": "mapa-antigo",
  "theme-neon": "neon",
  "theme-oceano": "oceano",
  "theme-espaco": "espaco",
  "theme-biblioteca": "biblioteca",
  "theme-minimalista": "minimalista",
};

export function isSpecialTheme(themeId: string): boolean {
  return themeId in SPECIAL_THEME_DATA;
}

/** data-theme final a aplicar, dado o tema equipado e a preferência claro/escuro. */
export function resolveDataTheme(
  themeId: string,
  preference: ThemePreference,
  systemPrefersDark: boolean,
): string {
  const special = SPECIAL_THEME_DATA[themeId];
  if (special) {
    return special;
  }
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return preference;
}
