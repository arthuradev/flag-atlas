import { describe, expect, it } from "vitest";
import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";
import {
  ACHIEVEMENT_COIN_REWARD,
  computeAchievementCoins,
  computeMissionCoins,
  computeSessionCoins,
  MISSION_COIN_REWARD,
  PERFECT_SESSION_BONUS,
  SESSION_COIN_REWARD,
  SURVIVAL_COIN_CAP,
} from "./coinRewards";

function event(overrides: Partial<AchievementSessionEvent> = {}): AchievementSessionEvent {
  return {
    mode: "continue",
    questionType: "choice",
    questionCount: 10,
    correctCount: 7,
    accuracy: 70,
    bestStreak: 3,
    ...overrides,
  };
}

describe("computeSessionCoins", () => {
  it("gives the base reward for a normal session", () => {
    expect(computeSessionCoins(event())).toBe(SESSION_COIN_REWARD);
  });

  it("adds the perfect bonus for a flawless session", () => {
    expect(computeSessionCoins(event({ accuracy: 100, correctCount: 10 }))).toBe(
      SESSION_COIN_REWARD + PERFECT_SESSION_BONUS,
    );
  });

  it("does not add the perfect bonus for an empty session", () => {
    expect(computeSessionCoins(event({ accuracy: 100, questionCount: 0, correctCount: 0 }))).toBe(
      SESSION_COIN_REWARD,
    );
  });

  it("rewards survival by score", () => {
    expect(computeSessionCoins(event({ mode: "survival", correctCount: 12 }))).toBe(12);
  });

  it("caps survival rewards", () => {
    expect(computeSessionCoins(event({ mode: "survival", correctCount: 999 }))).toBe(
      SURVIVAL_COIN_CAP,
    );
  });

  it("never returns negative coins for survival", () => {
    expect(computeSessionCoins(event({ mode: "survival", correctCount: -5 }))).toBe(0);
  });
});

describe("computeAchievementCoins", () => {
  it("scales with the number of unlocked achievements", () => {
    expect(computeAchievementCoins(0)).toBe(0);
    expect(computeAchievementCoins(2)).toBe(2 * ACHIEVEMENT_COIN_REWARD);
  });

  it("never returns negative coins", () => {
    expect(computeAchievementCoins(-3)).toBe(0);
  });
});

describe("computeMissionCoins", () => {
  it("scales with the number of completed missions", () => {
    expect(computeMissionCoins(3)).toBe(3 * MISSION_COIN_REWARD);
  });

  it("never returns negative coins", () => {
    expect(computeMissionCoins(-1)).toBe(0);
  });
});
