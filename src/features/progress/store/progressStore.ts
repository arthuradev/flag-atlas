import { create } from "zustand";
import {
  type CountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { computeLevel } from "@/features/progress/logic/xp";
import { clearProgress, loadProgress, saveProgress } from "@/shared/storage/progressRepository";

type ProgressState = {
  progress: UserProgress;
  registerAnswer: (countryProgress: CountryProgress, xpGained: number, answeredAt: string) => void;
  registerCompletedSession: () => void;
  resetProgress: () => void;
};

/** Progresso do usuário, carregado e persistido em localStorage versionado. */
export const useProgressStore = create<ProgressState>((set) => {
  const update = (recipe: (progress: UserProgress) => UserProgress) => {
    set((state) => {
      const progress = recipe(state.progress);
      saveProgress(progress);
      return { progress };
    });
  };

  return {
    progress: loadProgress(),
    registerAnswer: (countryProgress, xpGained, answeredAt) => {
      update((progress) => {
        const totalXp = progress.totalXp + xpGained;
        return {
          ...progress,
          totalXp,
          level: computeLevel(totalXp),
          countries: { ...progress.countries, [countryProgress.countryId]: countryProgress },
          lastPlayedAt: answeredAt,
        };
      });
    },
    registerCompletedSession: () => {
      update((progress) => ({
        ...progress,
        completedSessions: progress.completedSessions + 1,
      }));
    },
    resetProgress: () => {
      clearProgress();
      set({ progress: createInitialUserProgress() });
    },
  };
});
