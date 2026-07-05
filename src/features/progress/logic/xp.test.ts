import { describe, expect, it } from "vitest";
import {
  computeAnswerXp,
  computeLevel,
  getLevelProgress,
  getTotalXpRequiredForLevel,
  getXpRequiredForLevel,
  MAX_LEVEL,
  xpIntoCurrentLevel,
} from "./xp";

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

  it("uses a tiered curve instead of a flat 100 XP forever", () => {
    expect(computeLevel(99)).toBe(1);
    expect(computeLevel(100)).toBe(2);
    expect(computeLevel(999)).toBe(10);
    expect(computeLevel(1000)).toBe(11);
    expect(computeLevel(1149)).toBe(11);
    expect(computeLevel(1150)).toBe(12);
  });

  it("is safe against negative values", () => {
    expect(computeLevel(-50)).toBe(1);
  });

  it("caps the displayed level at 100 while keeping extra XP valid", () => {
    const xpForLevel100 = getTotalXpRequiredForLevel(MAX_LEVEL);
    expect(computeLevel(xpForLevel100)).toBe(100);
    expect(computeLevel(xpForLevel100 + 5_000)).toBe(100);
  });
});

describe("xpIntoCurrentLevel", () => {
  it("returns the XP within the current level", () => {
    expect(xpIntoCurrentLevel(0)).toBe(0);
    expect(xpIntoCurrentLevel(150)).toBe(50);
    expect(xpIntoCurrentLevel(1125)).toBe(125);
  });
});

describe("level XP helpers", () => {
  it("returns the configured cost for each level range", () => {
    expect(getXpRequiredForLevel(1)).toBe(100);
    expect(getXpRequiredForLevel(10)).toBe(100);
    expect(getXpRequiredForLevel(11)).toBe(150);
    expect(getXpRequiredForLevel(25)).toBe(150);
    expect(getXpRequiredForLevel(26)).toBe(250);
    expect(getXpRequiredForLevel(50)).toBe(250);
    expect(getXpRequiredForLevel(51)).toBe(400);
    expect(getXpRequiredForLevel(75)).toBe(400);
    expect(getXpRequiredForLevel(76)).toBe(600);
    expect(getXpRequiredForLevel(99)).toBe(600);
    expect(getXpRequiredForLevel(100)).toBe(0);
  });

  it("computes progress inside the current level", () => {
    expect(getLevelProgress(1125)).toEqual({
      level: 11,
      currentLevelXp: 125,
      xpForNextLevel: 150,
      progressRatio: 125 / 150,
      isMaxLevel: false,
    });
  });

  it("reports max-level progress without dividing by zero", () => {
    expect(getLevelProgress(getTotalXpRequiredForLevel(MAX_LEVEL) + 100)).toEqual({
      level: 100,
      currentLevelXp: 0,
      xpForNextLevel: 0,
      progressRatio: 1,
      isMaxLevel: true,
    });
  });
});
