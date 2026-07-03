import type { UserProgress } from "@/entities/progress/progress.types";
import { readJson, removeKey, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import {
  normalizeUserProgress,
  PROGRESS_SCHEMA_VERSION,
  unwrapEnvelope,
  wrapEnvelope,
} from "./storageSchema";

export function loadProgress(): UserProgress {
  const stored = readJson(STORAGE_KEYS.progress);
  return normalizeUserProgress(unwrapEnvelope(stored, PROGRESS_SCHEMA_VERSION));
}

export function saveProgress(progress: UserProgress): void {
  writeJson(STORAGE_KEYS.progress, wrapEnvelope(progress, PROGRESS_SCHEMA_VERSION));
}

export function clearProgress(): void {
  removeKey(STORAGE_KEYS.progress);
}
