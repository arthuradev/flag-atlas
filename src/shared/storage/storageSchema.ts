import {
  type AppSettings,
  DEFAULT_SETTINGS,
  SESSION_SIZES,
  type SessionSize,
  THEME_PREFERENCES,
  type ThemePreference,
} from "@/entities/settings/settings.types";
import { isLocale } from "@/shared/i18n/locale";

export const SETTINGS_SCHEMA_VERSION = 1;

export type VersionedEnvelope<T> = {
  schemaVersion: number;
  data: T;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normaliza dados de configurações vindos do localStorage.
 * Campos inválidos ou ausentes voltam ao padrão; nunca lança.
 */
export function normalizeSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return { ...DEFAULT_SETTINGS };
  }
  return {
    locale: isLocale(value.locale) ? value.locale : DEFAULT_SETTINGS.locale,
    theme: THEME_PREFERENCES.includes(value.theme as ThemePreference)
      ? (value.theme as ThemePreference)
      : DEFAULT_SETTINGS.theme,
    soundEnabled:
      typeof value.soundEnabled === "boolean" ? value.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
    volume:
      typeof value.volume === "number" && Number.isFinite(value.volume)
        ? Math.min(1, Math.max(0, value.volume))
        : DEFAULT_SETTINGS.volume,
    reduceMotion:
      typeof value.reduceMotion === "boolean" ? value.reduceMotion : DEFAULT_SETTINGS.reduceMotion,
    defaultSessionSize: SESSION_SIZES.includes(value.defaultSessionSize as SessionSize)
      ? (value.defaultSessionSize as SessionSize)
      : DEFAULT_SETTINGS.defaultSessionSize,
  };
}

export function unwrapEnvelope(value: unknown, expectedVersion: number): unknown {
  if (!isRecord(value) || value.schemaVersion !== expectedVersion) {
    return null;
  }
  return value.data ?? null;
}

export function wrapEnvelope<T>(data: T, version: number): VersionedEnvelope<T> {
  return { schemaVersion: version, data };
}
