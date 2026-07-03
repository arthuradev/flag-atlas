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

  it("recomputes mastery level from points and clamps them", () => {
    const result = normalizeUserProgress({
      countries: {
        jp: { masteryPoints: 42, masteryLevel: "new" },
      },
    });
    expect(result.countries.jp?.masteryPoints).toBe(10);
    expect(result.countries.jp?.masteryLevel).toBe("master");
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
