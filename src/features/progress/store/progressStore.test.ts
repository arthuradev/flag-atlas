import { beforeEach, describe, expect, it } from "vitest";
import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";
import { createInitialCosmeticInventory } from "@/entities/cosmetic/cosmetic.types";
import { createInitialCountryProgress } from "@/entities/progress/progress.types";
import {
  ACHIEVEMENT_COIN_REWARD,
  PERFECT_SESSION_BONUS,
  SESSION_COIN_REWARD,
} from "@/features/cosmetics/logic/coinRewards";
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { useProgressStore } from "./progressStore";

const T0 = "2026-07-03T10:00:00.000Z";

function completionEvent(
  overrides: Partial<AchievementSessionEvent> = {},
): AchievementSessionEvent {
  return {
    mode: "continue",
    questionType: "choice",
    questionCount: 5,
    correctCount: 3,
    accuracy: 60,
    bestStreak: 2,
    ...overrides,
  };
}

describe("progressStore", () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it("accumulates XP and recomputes the level", () => {
    const store = useProgressStore.getState();
    const brazil = applyAnswerToCountryProgress(createInitialCountryProgress("br"), {
      isCorrect: true,
      answeredAt: T0,
    });
    for (let i = 0; i < 11; i++) {
      useProgressStore.getState().registerAnswer(brazil, 10, T0);
    }
    const progress = useProgressStore.getState().progress;
    expect(progress.totalXp).toBe(110);
    expect(progress.level).toBe(2);
    expect(progress.lastPlayedAt).toBe(T0);
    expect(store).toBeDefined();
  });

  it("stores per-country progress", () => {
    const japan = applyAnswerToCountryProgress(createInitialCountryProgress("jp"), {
      isCorrect: false,
      answeredAt: T0,
    });
    useProgressStore.getState().registerAnswer(japan, 0, T0);
    const progress = useProgressStore.getState().progress;
    expect(progress.countries.jp?.needsReview).toBe(true);
    expect(progress.countries.jp?.wrongCount).toBe(1);
  });

  it("counts completed sessions", () => {
    useProgressStore.getState().registerCompletedSession(completionEvent());
    useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(useProgressStore.getState().progress.completedSessions).toBe(2);
  });

  it("counts the daily streak once per day", () => {
    const first = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(first.dailyStreak.countedToday).toBe(true);
    expect(first.dailyStreak.streak.currentStreak).toBe(1);

    const second = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(second.dailyStreak.countedToday).toBe(false);
    expect(second.dailyStreak.streak.currentStreak).toBe(1);
    expect(useProgressStore.getState().progress.dailyStreak.currentStreak).toBe(1);
  });

  it("unlocks firstSteps on the first completed session", () => {
    const result = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(result.unlockedAchievementIds).toContain("firstSteps");
    expect(useProgressStore.getState().progress.achievementsUnlocked.firstSteps).toBeDefined();

    // A segunda sessão não desbloqueia de novo.
    const again = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(again.unlockedAchievementIds).not.toContain("firstSteps");
  });

  it("tracks survival records and reports new ones", () => {
    const first = useProgressStore
      .getState()
      .registerCompletedSession(
        completionEvent({ mode: "survival", correctCount: 12, bestStreak: 6 }),
      );
    expect(first.survival).toEqual({ score: 12, previousBest: 0, isNewRecord: true });

    const worse = useProgressStore
      .getState()
      .registerCompletedSession(
        completionEvent({ mode: "survival", correctCount: 7, bestStreak: 3 }),
      );
    expect(worse.survival).toEqual({ score: 7, previousBest: 12, isNewRecord: false });

    const progress = useProgressStore.getState().progress;
    expect(progress.survival.bestScore).toBe(12);
    expect(progress.survival.bestStreak).toBe(6);
    expect(progress.survival.sessionsCompleted).toBe(2);
  });

  it("does not touch survival records for normal sessions", () => {
    const result = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(result.survival).toBeUndefined();
    expect(useProgressStore.getState().progress.survival.sessionsCompleted).toBe(0);
  });

  it("adds mission bonus XP and recomputes the level", () => {
    useProgressStore.getState().addBonusXp(95);
    useProgressStore.getState().addBonusXp(10);
    const progress = useProgressStore.getState().progress;
    expect(progress.totalXp).toBe(105);
    expect(progress.level).toBe(2);
  });

  it("resets everything back to the initial state", () => {
    const brazil = applyAnswerToCountryProgress(createInitialCountryProgress("br"), {
      isCorrect: true,
      answeredAt: T0,
    });
    useProgressStore.getState().registerAnswer(brazil, 15, T0);
    useProgressStore.getState().registerCompletedSession(completionEvent());

    useProgressStore.getState().resetProgress();

    const progress = useProgressStore.getState().progress;
    expect(progress.totalXp).toBe(0);
    expect(progress.level).toBe(1);
    expect(progress.countries).toEqual({});
    expect(progress.completedSessions).toBe(0);
    expect(progress.cosmetics).toEqual(createInitialCosmeticInventory());
  });
});

describe("progressStore — Flaggo Coins (V4)", () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it("awards session coins plus achievement coins on the first session", () => {
    // A primeira sessão concluída também desbloqueia firstSteps (+moedas).
    const result = useProgressStore.getState().registerCompletedSession(completionEvent());
    expect(result.coinsEarned).toBe(SESSION_COIN_REWARD + ACHIEVEMENT_COIN_REWARD);
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(
      SESSION_COIN_REWARD + ACHIEVEMENT_COIN_REWARD,
    );
  });

  it("does not award the same achievement coins twice", () => {
    useProgressStore.getState().registerCompletedSession(completionEvent());
    const second = useProgressStore.getState().registerCompletedSession(completionEvent());
    // Só a base da sessão: firstSteps já foi concedida.
    expect(second.coinsEarned).toBe(SESSION_COIN_REWARD);
  });

  it("adds the perfect-session bonus", () => {
    useProgressStore.getState().registerCompletedSession(completionEvent()); // firstSteps sai aqui
    // Sessão curta (< mínimo da conquista flawless) isola o bônus de perfeição.
    const perfect = useProgressStore
      .getState()
      .registerCompletedSession(
        completionEvent({ accuracy: 100, correctCount: 4, questionCount: 4 }),
      );
    expect(perfect.coinsEarned).toBe(SESSION_COIN_REWARD + PERFECT_SESSION_BONUS);
  });

  it("rewards survival by score, capped", () => {
    useProgressStore.getState().registerCompletedSession(completionEvent()); // firstSteps
    const survival = useProgressStore
      .getState()
      .registerCompletedSession(completionEvent({ mode: "survival", correctCount: 12 }));
    expect(survival.coinsEarned).toBe(12);
  });

  it("credits coins via addCoins and never goes negative", () => {
    useProgressStore.getState().addCoins(50);
    useProgressStore.getState().addCoins(-999);
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(50);
  });

  it("purchases a cosmetic when there are enough coins", () => {
    useProgressStore.getState().addCoins(200);
    useProgressStore.getState().purchaseCosmetic("theme-oceano");
    const cosmetics = useProgressStore.getState().progress.cosmetics;
    expect(cosmetics.coins).toBe(80);
    expect(cosmetics.ownedItemIds).toContain("theme-oceano");
  });

  it("does not purchase a cosmetic without enough coins", () => {
    useProgressStore.getState().addCoins(10);
    useProgressStore.getState().purchaseCosmetic("theme-oceano");
    const cosmetics = useProgressStore.getState().progress.cosmetics;
    expect(cosmetics.coins).toBe(10);
    expect(cosmetics.ownedItemIds).not.toContain("theme-oceano");
  });

  it("equips an owned cosmetic without spending coins", () => {
    useProgressStore.getState().addCoins(200);
    useProgressStore.getState().purchaseCosmetic("theme-oceano");
    useProgressStore.getState().equipCosmetic("theme-oceano");
    const cosmetics = useProgressStore.getState().progress.cosmetics;
    expect(cosmetics.equipped.themeId).toBe("theme-oceano");
    expect(cosmetics.coins).toBe(80);
  });

  it("does not equip an unowned cosmetic", () => {
    useProgressStore.getState().equipCosmetic("theme-oceano");
    expect(useProgressStore.getState().progress.cosmetics.equipped.themeId).toBe("theme-default");
  });
});
