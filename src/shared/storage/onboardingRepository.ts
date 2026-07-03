import { readJson, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import { unwrapEnvelope, wrapEnvelope } from "./storageSchema";

export const ONBOARDING_SCHEMA_VERSION = 1;

export function loadHasCompletedOnboarding(): boolean {
  const data = unwrapEnvelope(readJson(STORAGE_KEYS.onboarding), ONBOARDING_SCHEMA_VERSION);
  if (typeof data === "object" && data !== null && "hasCompletedOnboarding" in data) {
    return (data as { hasCompletedOnboarding: unknown }).hasCompletedOnboarding === true;
  }
  return false;
}

export function saveHasCompletedOnboarding(hasCompletedOnboarding: boolean): void {
  writeJson(
    STORAGE_KEYS.onboarding,
    wrapEnvelope({ hasCompletedOnboarding }, ONBOARDING_SCHEMA_VERSION),
  );
}
