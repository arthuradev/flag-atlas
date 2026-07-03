import { create } from "zustand";
import {
  type CountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { computeLevel } from "@/features/progress/logic/xp";

type ProgressState = {
  progress: UserProgress;
  registerAnswer: (countryProgress: CountryProgress, xpGained: number, answeredAt: string) => void;
  registerCompletedSession: () => void;
};

/**
 * Progresso do usuário em memória. A persistência local versionada
 * é conectada na Fase 5.
 */
export const useProgressStore = create<ProgressState>((set) => ({
  progress: createInitialUserProgress(),
  registerAnswer: (countryProgress, xpGained, answeredAt) => {
    set((state) => {
      const totalXp = state.progress.totalXp + xpGained;
      return {
        progress: {
          ...state.progress,
          totalXp,
          level: computeLevel(totalXp),
          countries: {
            ...state.progress.countries,
            [countryProgress.countryId]: countryProgress,
          },
          lastPlayedAt: answeredAt,
        },
      };
    });
  },
  registerCompletedSession: () => {
    set((state) => ({
      progress: {
        ...state.progress,
        completedSessions: state.progress.completedSessions + 1,
      },
    }));
  },
}));
