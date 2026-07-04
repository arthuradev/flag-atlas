import { create } from "zustand";
import { evaluateNewAchievements } from "@/entities/achievement/achievement.selectors";
import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";
import {
  type CountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { type DailyStreakUpdate, registerActiveDay } from "@/features/progress/logic/dailyStreak";
import { computeLevel } from "@/features/progress/logic/xp";
import { clearProgress, loadProgress, saveProgress } from "@/shared/storage/progressRepository";
import { getLocalDateKey } from "@/shared/utils/dateKey";

export type SurvivalCompletionResult = {
  score: number;
  previousBest: number;
  isNewRecord: boolean;
};

export type SessionCompletionResult = {
  unlockedAchievementIds: string[];
  dailyStreak: DailyStreakUpdate;
  survival?: SurvivalCompletionResult;
};

type ProgressState = {
  progress: UserProgress;
  /** Registra a resposta e devolve conquistas recém-desbloqueadas por ela. */
  registerAnswer: (
    countryProgress: CountryProgress,
    xpGained: number,
    answeredAt: string,
  ) => string[];
  /** Fecha a sessão: streak diário, recordes de sobrevivência e conquistas. */
  registerCompletedSession: (event: AchievementSessionEvent) => SessionCompletionResult;
  /** XP de missão diária, concedido fora do fluxo de resposta. */
  addBonusXp: (xp: number) => void;
  resetProgress: () => void;
};

function withUnlockedAchievements(
  progress: UserProgress,
  achievementIds: readonly string[],
  unlockedAt: string,
): UserProgress {
  if (achievementIds.length === 0) {
    return progress;
  }
  const achievementsUnlocked = { ...progress.achievementsUnlocked };
  for (const id of achievementIds) {
    achievementsUnlocked[id] = unlockedAt;
  }
  return { ...progress, achievementsUnlocked };
}

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
      let unlockedIds: string[] = [];
      update((previous) => {
        const totalXp = previous.totalXp + xpGained;
        let progress: UserProgress = {
          ...previous,
          totalXp,
          level: computeLevel(totalXp),
          countries: { ...previous.countries, [countryProgress.countryId]: countryProgress },
          lastPlayedAt: answeredAt,
        };
        unlockedIds = evaluateNewAchievements({ progress });
        progress = withUnlockedAchievements(progress, unlockedIds, answeredAt);
        return progress;
      });
      return unlockedIds;
    },

    registerCompletedSession: (event) => {
      const completedAt = new Date().toISOString();
      let result: SessionCompletionResult | undefined;
      update((previous) => {
        let progress: UserProgress = {
          ...previous,
          completedSessions: previous.completedSessions + 1,
        };

        const streakUpdate = registerActiveDay(progress.dailyStreak, getLocalDateKey());
        progress = { ...progress, dailyStreak: streakUpdate.streak };

        let survival: SurvivalCompletionResult | undefined;
        if (event.mode === "survival") {
          const previousBest = progress.survival.bestScore;
          const score = event.correctCount;
          progress = {
            ...progress,
            survival: {
              bestScore: Math.max(previousBest, score),
              bestStreak: Math.max(progress.survival.bestStreak, event.bestStreak),
              sessionsCompleted: progress.survival.sessionsCompleted + 1,
            },
          };
          survival = { score, previousBest, isNewRecord: score > previousBest };
        }

        const unlockedIds = evaluateNewAchievements({ progress, sessionEvent: event });
        progress = withUnlockedAchievements(progress, unlockedIds, completedAt);

        result = {
          unlockedAchievementIds: unlockedIds,
          dailyStreak: streakUpdate,
          ...(survival !== undefined && { survival }),
        };
        return progress;
      });
      if (result === undefined) {
        // update() roda de forma síncrona: isto é inalcançável.
        throw new Error("registerCompletedSession did not run");
      }
      return result;
    },

    addBonusXp: (xp) => {
      if (xp <= 0) {
        return;
      }
      update((previous) => {
        const totalXp = previous.totalXp + xp;
        return { ...previous, totalXp, level: computeLevel(totalXp) };
      });
    },

    resetProgress: () => {
      clearProgress();
      set({ progress: createInitialUserProgress() });
    },
  };
});
