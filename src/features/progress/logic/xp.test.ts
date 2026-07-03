import { describe, expect, it } from "vitest";
import { computeAnswerXp, computeLevel, xpIntoCurrentLevel } from "./xp";

describe("computeAnswerXp", () => {
  it("gives base XP for a correct answer", () => {
    expect(computeAnswerXp({ isCorrect: true, promoted: false, streakAfter: 1 })).toBe(10);
  });

  it("adds a bonus for mastery promotion", () => {
    expect(computeAnswerXp({ isCorrect: true, promoted: true, streakAfter: 1 })).toBe(15);
  });

  it("adds a bonus for streaks of 5 or more", () => {
    expect(computeAnswerXp({ isCorrect: true, promoted: false, streakAfter: 5 })).toBe(12);
    expect(computeAnswerXp({ isCorrect: true, promoted: false, streakAfter: 4 })).toBe(10);
  });

  it("stacks promotion and streak bonuses", () => {
    expect(computeAnswerXp({ isCorrect: true, promoted: true, streakAfter: 7 })).toBe(17);
  });

  it("never punishes a wrong answer", () => {
    expect(computeAnswerXp({ isCorrect: false, promoted: false, streakAfter: 0 })).toBe(0);
    expect(computeAnswerXp({ isCorrect: false, promoted: true, streakAfter: 9 })).toBe(0);
  });
});

describe("computeLevel", () => {
  it("starts at level 1 with no XP", () => {
    expect(computeLevel(0)).toBe(1);
  });

  it("levels up every 100 XP", () => {
    expect(computeLevel(99)).toBe(1);
    expect(computeLevel(100)).toBe(2);
    expect(computeLevel(250)).toBe(3);
  });

  it("is safe against negative values", () => {
    expect(computeLevel(-50)).toBe(1);
  });
});

describe("xpIntoCurrentLevel", () => {
  it("returns the XP within the current level", () => {
    expect(xpIntoCurrentLevel(0)).toBe(0);
    expect(xpIntoCurrentLevel(150)).toBe(50);
  });
});
