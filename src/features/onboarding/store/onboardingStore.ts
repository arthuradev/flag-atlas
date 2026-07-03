import { create } from "zustand";
import {
  loadHasCompletedOnboarding,
  saveHasCompletedOnboarding,
} from "@/shared/storage/onboardingRepository";

type OnboardingState = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: loadHasCompletedOnboarding(),
  completeOnboarding: () => {
    saveHasCompletedOnboarding(true);
    set({ hasCompletedOnboarding: true });
  },
}));
