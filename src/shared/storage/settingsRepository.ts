import type { AppSettings } from "@/entities/settings/settings.types";
import { readJson, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import {
  normalizeSettings,
  SETTINGS_SCHEMA_VERSION,
  unwrapEnvelope,
  wrapEnvelope,
} from "./storageSchema";

export function loadSettings(): AppSettings {
  const stored = readJson(STORAGE_KEYS.settings);
  return normalizeSettings(unwrapEnvelope(stored, SETTINGS_SCHEMA_VERSION));
}

export function saveSettings(settings: AppSettings): void {
  writeJson(STORAGE_KEYS.settings, wrapEnvelope(settings, SETTINGS_SCHEMA_VERSION));
}
