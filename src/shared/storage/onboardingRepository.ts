import { readJson, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import { unwrapEnvelope, wrapEnvelope } from "./storageSchema";

export const ONBOARDING_SCHEMA_VERSION = 1;

export const START_MODES = ["new", "some", "review"] as const;
export type OnboardingStartMode = (typeof START_MODES)[number];

export const DAILY_GOALS = [5, 10, 15, 20] as const;
export type OnboardingDailyGoal = (typeof DAILY_GOALS)[number];

export type OnboardingRecord = {
  hasSeenSplash: boolean;
  hasCompletedIntro: boolean;
  selectedStartMode: OnboardingStartMode | null;
  dailyGoal: OnboardingDailyGoal | null;
  hasCompletedLessonZero: boolean;
  hasSeenFirstReward: boolean;
  hasCompletedOnboarding: boolean;
  profileName: string;
};

const EMPTY_RECORD: OnboardingRecord = {
  hasSeenSplash: false,
  hasCompletedIntro: false,
  selectedStartMode: null,
  dailyGoal: null,
  hasCompletedLessonZero: false,
  hasSeenFirstReward: false,
  hasCompletedOnboarding: false,
  profileName: "",
};

const MAX_NAME_LENGTH = 20;

function isStartMode(value: unknown): value is OnboardingStartMode {
  return START_MODES.includes(value as OnboardingStartMode);
}

function isDailyGoal(value: unknown): value is OnboardingDailyGoal {
  return DAILY_GOALS.includes(value as OnboardingDailyGoal);
}

function normalizeName(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_NAME_LENGTH) : "";
}

export function loadOnboarding(): OnboardingRecord {
  const data = unwrapEnvelope(readJson(STORAGE_KEYS.onboarding), ONBOARDING_SCHEMA_VERSION);
  if (typeof data !== "object" || data === null) {
    return { ...EMPTY_RECORD };
  }
  const record = data as Record<string, unknown>;
  const hasCompletedOnboarding = record.hasCompletedOnboarding === true;
  const profileName = normalizeName(record.profileName ?? record.playerName);

  return {
    hasSeenSplash: record.hasSeenSplash === true || hasCompletedOnboarding,
    hasCompletedIntro: record.hasCompletedIntro === true || hasCompletedOnboarding,
    selectedStartMode: isStartMode(record.selectedStartMode) ? record.selectedStartMode : null,
    dailyGoal: isDailyGoal(record.dailyGoal) ? record.dailyGoal : null,
    hasCompletedLessonZero: record.hasCompletedLessonZero === true || hasCompletedOnboarding,
    hasSeenFirstReward: record.hasSeenFirstReward === true || hasCompletedOnboarding,
    hasCompletedOnboarding,
    profileName,
  };
}

export function saveOnboarding(record: OnboardingRecord): void {
  writeJson(
    STORAGE_KEYS.onboarding,
    wrapEnvelope(
      {
        hasSeenSplash: record.hasSeenSplash,
        hasCompletedIntro: record.hasCompletedIntro,
        selectedStartMode: record.selectedStartMode,
        dailyGoal: record.dailyGoal,
        hasCompletedLessonZero: record.hasCompletedLessonZero,
        hasSeenFirstReward: record.hasSeenFirstReward,
        hasCompletedOnboarding: record.hasCompletedOnboarding,
        profileName: record.profileName.slice(0, MAX_NAME_LENGTH),
      },
      ONBOARDING_SCHEMA_VERSION,
    ),
  );
}
