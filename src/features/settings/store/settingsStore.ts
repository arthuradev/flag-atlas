import { create } from "zustand";
import type { AppSettings, SessionSize, ThemePreference } from "@/entities/settings/settings.types";
import type { Locale } from "@/shared/i18n/locale";
import { loadSettings, saveSettings } from "@/shared/storage/settingsRepository";

type SettingsState = AppSettings & {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemePreference) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setReduceMotion: (reduce: boolean) => void;
  setDefaultSessionSize: (size: SessionSize) => void;
};

function toSettings(state: SettingsState): AppSettings {
  return {
    locale: state.locale,
    theme: state.theme,
    soundEnabled: state.soundEnabled,
    volume: state.volume,
    reduceMotion: state.reduceMotion,
    defaultSessionSize: state.defaultSessionSize,
  };
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const update = (partial: Partial<AppSettings>) => {
    set(partial);
    saveSettings(toSettings(get()));
  };

  return {
    ...loadSettings(),
    setLocale: (locale) => update({ locale }),
    setTheme: (theme) => update({ theme }),
    setSoundEnabled: (soundEnabled) => update({ soundEnabled }),
    setVolume: (volume) => update({ volume: Math.min(1, Math.max(0, volume)) }),
    setReduceMotion: (reduceMotion) => update({ reduceMotion }),
    setDefaultSessionSize: (defaultSessionSize) => update({ defaultSessionSize }),
  };
});
