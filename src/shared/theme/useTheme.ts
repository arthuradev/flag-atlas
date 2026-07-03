import { useEffect } from "react";
import type { ThemePreference } from "@/entities/settings/settings.types";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): "light" | "dark" {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }
  return preference;
}

function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.dataset.theme = theme;
}

/** Mantém o atributo data-theme do <html> em sincronia com a preferência do usuário. */
export function useTheme(): void {
  const preference = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(resolveTheme(preference, media.matches));

    if (preference !== "system") {
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme(resolveTheme(preference, event.matches));
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);
}
