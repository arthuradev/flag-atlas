import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadSettings } from "@/shared/storage/settingsRepository";
import { DEFAULT_LOCALE } from "./locale";
import enUS from "./locales/en-US.json";
import ptBR from "./locales/pt-BR.json";

void i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: ptBR },
    "en-US": { translation: enUS },
  },
  lng: loadSettings().locale,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    // React já escapa valores interpolados.
    escapeValue: false,
  },
});

export { i18n };
