import { create } from "zustand";
import { evaluateNewAchievements } from "@/entities/achievement/achievement.selectors";
import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";
import {
  equipCosmetic as equipCosmeticInInventory,
  purchaseCosmetic as purchaseCosmeticInInventory,
} from "@/entities/cosmetic/cosmetic.selectors";
import {
  type CountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import {
  computeAchievementCoins,
  computeSessionCoins,
} from "@/features/cosmetics/logic/coinRewards";
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
  /** Moedas Atlas concedidas ao fechar a sessão (sessão + conquistas do fim). */
  coinsEarned: number;
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
  /** Credita Moedas Atlas cosméticas (missões, etc.). Nunca deixa o saldo negativo. */
  addCoins: (coins: number) => void;
  /** Compra um cosmético com Moedas Atlas, se possível. */
  purchaseCosmetic: (id: string) => void;
  /** Equipa um cosmético possuído (nunca custa moedas). */
  equipCosmetic: (id: string) => void;
  resetProgress: () => void;
};

/** Credita moedas ao inventário cosmético de forma imutável e segura. */
function grantCoins(progress: UserProgress, coins: number): UserProgress {
  if (coins <= 0) {
    return progress;
  }
  return {
    ...progress,
    cosmetics: { ...progress.cosmetics, coins: progress.cosmetics.coins + coins },
  };
}

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
        // Moedas por conquistas desbloqueadas no meio da sessão, uma vez cada.
        progress = grantCoins(progress, computeAchievementCoins(unlockedIds.length));
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

        // Moedas cosméticas: base da sessão + conquistas fechadas agora.
        const coinsEarned =
          computeSessionCoins(event) + computeAchievementCoins(unlockedIds.length);
        progress = grantCoins(progress, coinsEarned);

        result = {
          unlockedAchievementIds: unlockedIds,
          dailyStreak: streakUpdate,
          coinsEarned,
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

    addCoins: (coins) => {
      if (coins <= 0) {
        return;
      }
      update((previous) => grantCoins(previous, coins));
    },

    purchaseCosmetic: (id) => {
      update((previous) => ({
        ...previous,
        cosmetics: purchaseCosmeticInInventory(previous.cosmetics, id),
      }));
    },

    equipCosmetic: (id) => {
      update((previous) => ({
        ...previous,
        cosmetics: equipCosmeticInInventory(previous.cosmetics, id),
      }));
    },

    resetProgress: () => {
      clearProgress();
      set({ progress: createInitialUserProgress() });
    },
  };
});
