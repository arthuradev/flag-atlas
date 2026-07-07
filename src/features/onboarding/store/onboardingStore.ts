import { create } from "zustand";
import {
  loadOnboarding,
  type OnboardingDailyGoal,
  type OnboardingRecord,
  type OnboardingStartMode,
  saveOnboarding,
} from "@/shared/storage/onboardingRepository";

type OnboardingState = OnboardingRecord & {
  /** Backward-compatible alias used by older UI modules. */
  playerName: string;
  markSplashSeen: () => void;
  completeIntro: () => void;
  selectStartMode: (mode: OnboardingStartMode) => void;
  setDailyGoal: (goal: OnboardingDailyGoal) => void;
  completeLessonZero: () => void;
  markFirstRewardSeen: () => void;
  completeOnboarding: (playerName?: string) => void;
};

function toRecord(state: OnboardingState): OnboardingRecord {
  return {
    hasSeenSplash: state.hasSeenSplash,
    hasCompletedIntro: state.hasCompletedIntro,
    selectedStartMode: state.selectedStartMode,
    dailyGoal: state.dailyGoal,
    hasCompletedLessonZero: state.hasCompletedLessonZero,
    hasSeenFirstReward: state.hasSeenFirstReward,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    profileName: state.profileName,
  };
}

export const useOnboardingStore = create<OnboardingState>((set, get) => {
  const loaded = loadOnboarding();

  const update = (partial: Partial<OnboardingRecord>) => {
    set((state) => {
      const profileName =
        partial.profileName !== undefined ? partial.profileName.trim() : state.profileName;
      const next = {
        ...state,
        ...partial,
        profileName,
        playerName: profileName,
      };
      saveOnboarding(toRecord(next));
      return next;
    });
  };

  return {
    ...loaded,
    playerName: loaded.profileName,

    markSplashSeen: () => update({ hasSeenSplash: true }),

    completeIntro: () => update({ hasCompletedIntro: true }),

    selectStartMode: (selectedStartMode) => update({ selectedStartMode }),

    setDailyGoal: (dailyGoal) => update({ dailyGoal }),

    completeLessonZero: () => update({ hasCompletedLessonZero: true }),

    markFirstRewardSeen: () => update({ hasSeenFirstReward: true }),

    completeOnboarding: (playerName) => {
      const profileName = (playerName ?? get().profileName).trim();
      update({
        hasSeenSplash: true,
        hasCompletedIntro: true,
        hasCompletedLessonZero: true,
        hasSeenFirstReward: true,
        hasCompletedOnboarding: true,
        profileName,
      });
    },
  };
});
