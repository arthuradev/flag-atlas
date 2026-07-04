import { beforeEach, describe, expect, it } from "vitest";
import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";
import { createInitialCountryProgress } from "@/entities/progress/progress.types";
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
  });
});
