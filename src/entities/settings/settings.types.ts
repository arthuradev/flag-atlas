import { DEFAULT_LOCALE, type Locale } from "@/shared/i18n/locale";

export const SESSION_SIZES = [5, 10, 20, 50] as const;

export type SessionSize = (typeof SESSION_SIZES)[number];

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type AppSettings = {
  locale: Locale;
  theme: ThemePreference;
  soundEnabled: boolean;
  volume: number;
  reduceMotion: boolean;
  defaultSessionSize: SessionSize;
};

export const DEFAULT_SETTINGS: AppSettings = {
  locale: DEFAULT_LOCALE,
  theme: "system",
  soundEnabled: true,
  volume: 0.8,
  reduceMotion: false,
  defaultSessionSize: 10,
};
