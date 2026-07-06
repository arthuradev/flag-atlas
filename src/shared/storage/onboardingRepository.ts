import { readJson, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import { unwrapEnvelope, wrapEnvelope } from "./storageSchema";

export const ONBOARDING_SCHEMA_VERSION = 1;

export type OnboardingRecord = {
  hasCompletedOnboarding: boolean;
  playerName: string;
};

const EMPTY_RECORD: OnboardingRecord = {
  hasCompletedOnboarding: false,
  playerName: "",
};

const MAX_NAME_LENGTH = 20;

export function loadOnboarding(): OnboardingRecord {
  const data = unwrapEnvelope(readJson(STORAGE_KEYS.onboarding), ONBOARDING_SCHEMA_VERSION);
  if (typeof data !== "object" || data === null) {
    return { ...EMPTY_RECORD };
  }
  const record = data as Record<string, unknown>;
  return {
    hasCompletedOnboarding: record.hasCompletedOnboarding === true,
    playerName:
      typeof record.playerName === "string" ? record.playerName.slice(0, MAX_NAME_LENGTH) : "",
  };
}

export function saveOnboarding(record: OnboardingRecord): void {
  writeJson(
    STORAGE_KEYS.onboarding,
    wrapEnvelope(
      {
        hasCompletedOnboarding: record.hasCompletedOnboarding,
        playerName: record.playerName.slice(0, MAX_NAME_LENGTH),
      },
      ONBOARDING_SCHEMA_VERSION,
    ),
  );
}
