import { beforeEach, describe, expect, it } from "vitest";
import { createInitialCountryProgress } from "@/entities/progress/progress.types";
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { useProgressStore } from "./progressStore";

const T0 = "2026-07-03T10:00:00.000Z";

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
    useProgressStore.getState().registerCompletedSession();
    useProgressStore.getState().registerCompletedSession();
    expect(useProgressStore.getState().progress.completedSessions).toBe(2);
  });

  it("resets everything back to the initial state", () => {
    const brazil = applyAnswerToCountryProgress(createInitialCountryProgress("br"), {
      isCorrect: true,
      answeredAt: T0,
    });
    useProgressStore.getState().registerAnswer(brazil, 15, T0);
    useProgressStore.getState().registerCompletedSession();

    useProgressStore.getState().resetProgress();

    const progress = useProgressStore.getState().progress;
    expect(progress.totalXp).toBe(0);
    expect(progress.level).toBe(1);
    expect(progress.countries).toEqual({});
    expect(progress.completedSessions).toBe(0);
  });
});
