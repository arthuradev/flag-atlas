import { useEffect } from "react";
import { isSpecialTheme, resolveDataTheme } from "@/features/cosmetics/logic/themes";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

function applyTheme(dataTheme: string): void {
  document.documentElement.dataset.theme = dataTheme;
}

/**
 * Mantém o atributo data-theme do <html> em sincronia com a preferência
 * claro/escuro/sistema e com o tema cosmético equipado (Versão 4). O tema
 * padrão segue a preferência; temas cosméticos especiais aplicam sua paleta.
 */
export function useTheme(): void {
  const preference = useSettingsStore((state) => state.theme);
  const themeId = useEquippedId("theme");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(resolveDataTheme(themeId, preference, media.matches));

    // Só o tema padrão em modo "system" precisa reagir à mudança do SO.
    const followsSystem = !isSpecialTheme(themeId) && preference === "system";
    if (!followsSystem) {
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme(resolveDataTheme(themeId, preference, event.matches));
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference, themeId]);
}
