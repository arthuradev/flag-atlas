import { create } from "zustand";
import { loadOnboarding, saveOnboarding } from "@/shared/storage/onboardingRepository";

type OnboardingState = {
  hasCompletedOnboarding: boolean;
  playerName: string;
  completeOnboarding: (playerName?: string) => void;
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...loadOnboarding(),
  completeOnboarding: (playerName) => {
    const name = (playerName ?? get().playerName).trim();
    saveOnboarding({ hasCompletedOnboarding: true, playerName: name });
    set({ hasCompletedOnboarding: true, playerName: name });
  },
}));
