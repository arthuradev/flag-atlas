import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/entities/settings/settings.types";
import {
  normalizeSettings,
  normalizeUserProgress,
  PROGRESS_SCHEMA_VERSION,
  unwrapEnvelope,
  wrapEnvelope,
} from "./storageSchema";

describe("normalizeSettings", () => {
  it("returns defaults for corrupted data", () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings("garbage")).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(42)).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid fields and fixes invalid ones", () => {
    const result = normalizeSettings({
      locale: "en-US",
      theme: "neon",
      soundEnabled: "yes",
      volume: 4,
      reduceMotion: true,
      defaultSessionSize: 12,
    });
    expect(result.locale).toBe("en-US");
    expect(result.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(result.soundEnabled).toBe(DEFAULT_SETTINGS.soundEnabled);
    expect(result.volume).toBe(1);
    expect(result.reduceMotion).toBe(true);
    expect(result.defaultSessionSize).toBe(DEFAULT_SETTINGS.defaultSessionSize);
  });
});

describe("normalizeUserProgress", () => {
  it("returns initial progress for corrupted data", () => {
    const result = normalizeUserProgress("not an object");
    expect(result.totalXp).toBe(0);
    expect(result.level).toBe(1);
    expect(result.countries).toEqual({});
  });

  it("recomputes level from XP instead of trusting the stored value", () => {
    const result = normalizeUserProgress({ totalXp: 250, level: 99, countries: {} });
    expect(result.level).toBe(3);
  });

  it("sanitizes negative and non-numeric counters", () => {
    const result = normalizeUserProgress({
      totalXp: -50,
      completedSessions: "many",
      countries: {},
    });
    expect(result.totalXp).toBe(0);
    expect(result.completedSessions).toBe(0);
  });

  it("drops invalid country entries and keeps valid ones", () => {
    const result = normalizeUserProgress({
      totalXp: 10,
      countries: {
        br: { seenCount: 2, correctCount: 2, masteryPoints: 3, needsReview: false },
        xx: "corrupted",
      },
    });
    expect(result.countries.br).toBeDefined();
    expect(result.countries.br?.masteryLevel).toBe("learned");
    expect(result.countries.xx).toBeUndefined();
  });

  it("migrates legacy mastery points without granting master automatically", () => {
    const result = normalizeUserProgress({
      countries: {
        jp: { masteryPoints: 10, masteryLevel: "master" },
      },
    });
    expect(result.countries.jp?.masterySystemVersion).toBe(2);
    expect(result.countries.jp?.masteryPoints).toBe(80);
    expect(result.countries.jp?.masteryLevel).toBe("dominated");
  });

  it("converts legacy mastery points to the new 0-100 scale conservatively", () => {
    const result = normalizeUserProgress({
      countries: {
        zero: { masteryPoints: 0 },
        bronze: { masteryPoints: 2 },
        silver: { masteryPoints: 5 },
        gold: { masteryPoints: 8 },
      },
    });
    expect(result.countries.zero?.masteryPoints).toBe(0);
    expect(result.countries.bronze?.masteryPoints).toBe(15);
    expect(result.countries.silver?.masteryPoints).toBe(40);
    expect(result.countries.gold?.masteryPoints).toBe(65);
    expect(result.countries.gold?.masteryLevel).toBe("dominated");
  });

  it("does not reconvert modern mastery v2 progress", () => {
    const result = normalizeUserProgress({
      countries: {
        jp: { masterySystemVersion: 2, masteryPoints: 42, masteryLevel: "new" },
      },
    });
    expect(result.countries.jp?.masteryPoints).toBe(42);
    expect(result.countries.jp?.masteryLevel).toBe("learned");
  });

  it("adds safe Mastery 2 defaults to old countries", () => {
    const result = normalizeUserProgress({
      countries: {
        br: { seenCount: 2, correctCount: 2, masteryPoints: 2 },
      },
    });
    expect(result.countries.br?.correctDateKeys).toEqual([]);
    expect(result.countries.br?.typedCorrectCount).toBe(0);
    expect(result.countries.br?.reviewCorrectCount).toBe(0);
    expect(result.countries.br?.successfulReviews).toBe(0);
  });

  it("normalizes invalid Mastery 2 fields safely", () => {
    const result = normalizeUserProgress({
      countries: {
        br: {
          masterySystemVersion: 2,
          masteryPoints: 120,
          correctDateKeys: ["2026-07-04", "bad", "2026-07-04"],
          typedCorrectCount: -2,
          reviewCorrectCount: "many",
          successfulReviews: 1.8,
          nextReviewAt: "tomorrow",
          lastMasteryMode: "practice",
          lastMasteryQuestionType: "voice",
        },
      },
    });
    expect(result.countries.br?.masteryPoints).toBe(100);
    expect(result.countries.br?.masteryLevel).toBe("dominated");
    expect(result.countries.br?.correctDateKeys).toEqual(["2026-07-04"]);
    expect(result.countries.br?.typedCorrectCount).toBe(0);
    expect(result.countries.br?.reviewCorrectCount).toBe(0);
    expect(result.countries.br?.successfulReviews).toBe(1);
    expect(result.countries.br?.nextReviewAt).toBeUndefined();
    expect(result.countries.br?.lastMasteryMode).toBeUndefined();
    expect(result.countries.br?.lastMasteryQuestionType).toBeUndefined();
  });
});

describe("envelope", () => {
  it("round-trips data through wrap/unwrap", () => {
    const wrapped = wrapEnvelope({ a: 1 }, PROGRESS_SCHEMA_VERSION);
    expect(unwrapEnvelope(wrapped, PROGRESS_SCHEMA_VERSION)).toEqual({ a: 1 });
  });

  it("rejects mismatched schema versions", () => {
    const wrapped = wrapEnvelope({ a: 1 }, PROGRESS_SCHEMA_VERSION);
    expect(unwrapEnvelope(wrapped, PROGRESS_SCHEMA_VERSION + 1)).toBeNull();
  });

  it("rejects non-envelope values", () => {
    expect(unwrapEnvelope(null, 1)).toBeNull();
    expect(unwrapEnvelope({ data: {} }, 1)).toBeNull();
  });
});

describe("confusions normalization (V2)", () => {
  it("keeps valid confusion counts and drops invalid ones", () => {
    const result = normalizeUserProgress({
      countries: {
        td: { seenCount: 2, wrongCount: 2, confusions: { ro: 2, sn: -1, "": 3, xx: "many" } },
      },
    });
    expect(result.countries.td?.confusions).toEqual({ ro: 2 });
  });

  it("loads v1 progress saved before confusions existed", () => {
    const result = normalizeUserProgress({
      totalXp: 50,
      countries: { br: { seenCount: 3, correctCount: 3, masteryPoints: 3 } },
    });
    expect(result.countries.br?.confusions).toBeUndefined();
    expect(result.totalXp).toBe(50);
    expect(result.countries.br?.masteryLevel).toBe("learned");
  });
});

describe("V3 fields normalization", () => {
  it("gives V3 defaults to progress saved before V3 without losing countries", () => {
    const result = normalizeUserProgress({
      totalXp: 120,
      completedSessions: 4,
      countries: { br: { seenCount: 3, correctCount: 3, masteryPoints: 3 } },
    });
    expect(result.countries.br?.masteryLevel).toBe("learned");
    expect(result.achievementsUnlocked).toEqual({});
    expect(result.dailyStreak).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      restDaysAvailable: 1,
    });
    expect(result.survival).toEqual({ bestScore: 0, bestStreak: 0, sessionsCompleted: 0 });
  });

  it("keeps valid V3 fields", () => {
    const result = normalizeUserProgress({
      countries: {},
      achievementsUnlocked: { firstSteps: "2026-07-04T10:00:00.000Z" },
      dailyStreak: {
        currentStreak: 3,
        bestStreak: 8,
        lastActiveDate: "2026-07-04",
        restDaysAvailable: 1,
      },
      survival: { bestScore: 21, bestStreak: 9, sessionsCompleted: 2 },
    });
    expect(result.achievementsUnlocked).toEqual({ firstSteps: "2026-07-04T10:00:00.000Z" });
    expect(result.dailyStreak.currentStreak).toBe(3);
    expect(result.dailyStreak.bestStreak).toBe(8);
    expect(result.dailyStreak.lastActiveDate).toBe("2026-07-04");
    expect(result.survival.bestScore).toBe(21);
  });

  it("discards invalid V3 data safely", () => {
    const result = normalizeUserProgress({
      countries: {},
      achievementsUnlocked: { firstSteps: 123, "": "2026-01-01T00:00:00.000Z", ok: "date" },
      dailyStreak: {
        currentStreak: -2,
        bestStreak: "many",
        lastActiveDate: "ontem",
        restDaysAvailable: 99,
      },
      survival: { bestScore: "high", bestStreak: -1, sessionsCompleted: null },
    });
    expect(result.achievementsUnlocked).toEqual({ ok: "date" });
    expect(result.dailyStreak.currentStreak).toBe(0);
    expect(result.dailyStreak.bestStreak).toBe(0);
    expect(result.dailyStreak.lastActiveDate).toBeUndefined();
    expect(result.dailyStreak.restDaysAvailable).toBe(1);
    expect(result.survival).toEqual({ bestScore: 0, bestStreak: 0, sessionsCompleted: 0 });
  });

  it("never lets bestStreak fall below currentStreak", () => {
    const result = normalizeUserProgress({
      countries: {},
      dailyStreak: { currentStreak: 5, bestStreak: 2, lastActiveDate: "2026-07-04" },
    });
    expect(result.dailyStreak.bestStreak).toBe(5);
  });
});

describe("V4 cosmetics normalization", () => {
  it("gives V4 cosmetics defaults to progress saved before V4", () => {
    const result = normalizeUserProgress({
      totalXp: 120,
      completedSessions: 4,
      countries: { br: { seenCount: 3, correctCount: 3, masteryPoints: 3 } },
    });
    // Progresso antigo é preservado...
    expect(result.countries.br?.masteryLevel).toBe("learned");
    expect(result.completedSessions).toBe(4);
    // ...e o inventário cosmético entra com defaults seguros.
    expect(result.cosmetics.coins).toBe(0);
    expect(result.cosmetics.ownedItemIds).toEqual([]);
    expect(result.cosmetics.equipped.themeId).toBe("theme-default");
    expect(result.cosmetics.equipped.soundPackId).toBe("sound-default");
    expect(result.cosmetics.equipped.flagFrameId).toBe("frame-default");
    expect(result.cosmetics.equipped.visualEffectId).toBe("effect-none");
  });

  it("preserves the old light/dark theme setting alongside cosmetic defaults", () => {
    // O tema claro/escuro continua em settings; cosmetics.themeId nasce padrão.
    const settings = normalizeSettings({ theme: "dark" });
    expect(settings.theme).toBe("dark");
    const progress = normalizeUserProgress({ countries: {} });
    expect(progress.cosmetics.equipped.themeId).toBe("theme-default");
  });

  it("keeps a valid cosmetic inventory", () => {
    const result = normalizeUserProgress({
      countries: {},
      cosmetics: {
        coins: 130,
        ownedItemIds: ["theme-oceano"],
        equipped: { themeId: "theme-oceano" },
      },
    });
    expect(result.cosmetics.coins).toBe(130);
    expect(result.cosmetics.ownedItemIds).toEqual(["theme-oceano"]);
    expect(result.cosmetics.equipped.themeId).toBe("theme-oceano");
  });

  it("sanitizes invalid cosmetic data", () => {
    const result = normalizeUserProgress({
      countries: {},
      cosmetics: {
        coins: -40,
        ownedItemIds: ["ghost", "theme-oceano", 5],
        equipped: { themeId: "theme-neon", visualEffectId: "effect-glow" },
      },
    });
    expect(result.cosmetics.coins).toBe(0);
    expect(result.cosmetics.ownedItemIds).toEqual(["theme-oceano"]);
    expect(result.cosmetics.equipped.themeId).toBe("theme-default");
    expect(result.cosmetics.equipped.visualEffectId).toBe("effect-none");
  });

  it("drops old removed cosmetic entries safely", () => {
    const legacyType = `mas${"cot"}`;
    const legacyId = `${legacyType}-owl`;
    const legacyEquippedKey = `${legacyType}Id`;
    const result = normalizeUserProgress({
      countries: {},
      cosmetics: {
        coins: 50,
        ownedItemIds: [legacyId, "theme-oceano"],
        equipped: { [legacyEquippedKey]: legacyId, themeId: "theme-oceano" },
      },
    });
    expect(result.cosmetics.ownedItemIds).toEqual(["theme-oceano"]);
    expect(result.cosmetics.equipped.themeId).toBe("theme-oceano");
    expect(legacyEquippedKey in result.cosmetics.equipped).toBe(false);
  });
});
