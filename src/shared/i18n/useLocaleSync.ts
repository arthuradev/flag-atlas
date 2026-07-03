import { useEffect } from "react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { i18n } from "./index";

/** Mantém o i18next e o atributo lang do <html> em sincronia com o idioma escolhido. */
export function useLocaleSync(): void {
  const locale = useSettingsStore((state) => state.locale);

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
    document.documentElement.lang = locale;
  }, [locale]);
}
