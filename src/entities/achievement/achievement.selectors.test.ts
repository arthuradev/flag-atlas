import { describe, expect, it } from "vitest";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type MasteryLevel,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";
import {
  ACHIEVEMENTS,
  FLAWLESS_MIN_QUESTIONS,
  HOT_STREAK_TARGET,
  SURVIVOR_TARGET_SCORE,
} from "./achievement.catalog";
import { evaluateNewAchievements, listAchievementViews } from "./achievement.selectors";
import type { AchievementSessionEvent } from "./achievement.types";

function progressWithCountries(
  count: number,
  masteryLevel: MasteryLevel = "recognized",
  countryIds: readonly string[] = COUNTRIES.map((country) => country.id),
): UserProgress {
  const progress = createInitialUserProgress();
  for (const countryId of countryIds.slice(0, count)) {
    progress.countries[countryId] = {
      ...createInitialCountryProgress(countryId),
      seenCount: 1,
      correctCount: 1,
      masteryLevel,
      masteryPoints:
        masteryLevel === "master"
          ? 90
          : masteryLevel === "dominated"
            ? 70
            : masteryLevel === "learned"
              ? 25
              : 8,
    };
  }
  return progress;
}

function sessionEvent(overrides: Partial<AchievementSessionEvent>): AchievementSessionEvent {
  return {
    mode: "continue",
    questionType: "choice",
    questionCount: 10,
    correctCount: 8,
    accuracy: 80,
    bestStreak: 4,
    ...overrides,
  };
}

describe("evaluateNewAchievements", () => {
  it("unlocks nothing for a fresh profile", () => {
    expect(evaluateNewAchievements({ progress: createInitialUserProgress() })).toEqual([]);
  });

  it("unlocks firstSteps after the first completed session, not before", () => {
    const progress = createInitialUserProgress();
    expect(evaluateNewAchievements({ progress })).not.toContain("firstSteps");
    progress.completedSessions = 1;
    expect(evaluateNewAchievements({ progress })).toContain("firstSteps");
  });

  it("unlocks seen-count milestones at their thresholds", () => {
    expect(evaluateNewAchievements({ progress: progressWithCountries(24) })).not.toContain(
      "earlyExplorer",
    );
    expect(evaluateNewAchievements({ progress: progressWithCountries(25) })).toContain(
      "earlyExplorer",
    );
    expect(evaluateNewAchievements({ progress: progressWithCountries(100) })).toContain(
      "halfWorld",
    );
    expect(
      evaluateNewAchievements({ progress: progressWithCountries(COUNTRIES.length) }),
    ).toContain("livingAtlas");
  });

  it("unlocks gold mastery milestones from dominated countries", () => {
    expect(evaluateNewAchievements({ progress: progressWithCountries(1, "dominated") })).toContain(
      "firstMastery",
    );
    const result = evaluateNewAchievements({ progress: progressWithCountries(25, "dominated") });
    expect(result).toContain("collector");
    expect(result).not.toContain("worldMaster");
    expect(
      evaluateNewAchievements({
        progress: progressWithCountries(COUNTRIES.length, "dominated"),
      }),
    ).not.toContain("worldMaster");
  });

  it("unlocks Platinum achievements only from real master countries", () => {
    expect(evaluateNewAchievements({ progress: progressWithCountries(1, "master") })).toContain(
      "firstPlatinum",
    );
    expect(evaluateNewAchievements({ progress: progressWithCountries(10, "master") })).toContain(
      "platinumCollector",
    );
    expect(
      evaluateNewAchievements({
        progress: progressWithCountries(COUNTRIES.length, "master"),
      }),
    ).toContain("worldMaster");
  });

  it("unlocks a continent explorer after learning half of the continent", () => {
    const oceania = CONTINENTS.find((continent) => continent.id === "oceania");
    if (!oceania) {
      throw new Error("missing oceania");
    }
    const half = Math.ceil(oceania.countryIds.length / 2);
    const notEnough = progressWithCountries(half - 1, "learned", oceania.countryIds);
    expect(evaluateNewAchievements({ progress: notEnough })).not.toContain("explorerOceania");
    const enough = progressWithCountries(half, "learned", oceania.countryIds);
    expect(evaluateNewAchievements({ progress: enough })).toContain("explorerOceania");
  });

  it("unlocks flawless only on a perfect session with enough questions", () => {
    const progress = createInitialUserProgress();
    expect(
      evaluateNewAchievements({
        progress,
        sessionEvent: sessionEvent({ accuracy: 100, questionCount: FLAWLESS_MIN_QUESTIONS }),
      }),
    ).toContain("flawless");
    expect(
      evaluateNewAchievements({
        progress,
        sessionEvent: sessionEvent({ accuracy: 100, questionCount: FLAWLESS_MIN_QUESTIONS - 2 }),
      }),
    ).not.toContain("flawless");
    expect(
      evaluateNewAchievements({ progress, sessionEvent: sessionEvent({ accuracy: 90 }) }),
    ).not.toContain("flawless");
    expect(evaluateNewAchievements({ progress })).not.toContain("flawless");
  });

  it("unlocks hotStreak from the in-session streak", () => {
    const progress = createInitialUserProgress();
    expect(
      evaluateNewAchievements({
        progress,
        sessionEvent: sessionEvent({ bestStreak: HOT_STREAK_TARGET }),
      }),
    ).toContain("hotStreak");
    expect(
      evaluateNewAchievements({
        progress,
        sessionEvent: sessionEvent({ bestStreak: HOT_STREAK_TARGET - 1 }),
      }),
    ).not.toContain("hotStreak");
  });

  it("unlocks mode achievements from the completed session mode", () => {
    const progress = createInitialUserProgress();
    expect(
      evaluateNewAchievements({ progress, sessionEvent: sessionEvent({ mode: "review" }) }),
    ).toContain("honestReview");
    expect(
      evaluateNewAchievements({ progress, sessionEvent: sessionEvent({ mode: "similar" }) }),
    ).toContain("vexillologist");
    expect(
      evaluateNewAchievements({
        progress,
        sessionEvent: sessionEvent({ questionType: "typing" }),
      }),
    ).toContain("globalTypist");
  });

  it("unlocks survivor from the best survival score", () => {
    const progress = createInitialUserProgress();
    progress.survival.bestScore = SURVIVOR_TARGET_SCORE;
    expect(evaluateNewAchievements({ progress })).toContain("survivor");
    progress.survival.bestScore = SURVIVOR_TARGET_SCORE - 1;
    expect(evaluateNewAchievements({ progress })).not.toContain("survivor");
  });

  it("does not re-unlock achievements already recorded", () => {
    const progress = createInitialUserProgress();
    progress.completedSessions = 3;
    progress.achievementsUnlocked.firstSteps = "2026-07-01T00:00:00.000Z";
    expect(evaluateNewAchievements({ progress })).not.toContain("firstSteps");
  });
});

describe("listAchievementViews", () => {
  it("lists every achievement with unlocked ones first", () => {
    const progress = createInitialUserProgress();
    progress.achievementsUnlocked.hotStreak = "2026-07-04T00:00:00.000Z";
    const views = listAchievementViews(progress);
    expect(views).toHaveLength(ACHIEVEMENTS.length);
    expect(views[0]?.id).toBe("hotStreak");
    expect(views[0]?.unlocked).toBe(true);
    expect(views[0]?.unlockedAt).toBe("2026-07-04T00:00:00.000Z");
    expect(views.slice(1).every((view) => !view.unlocked)).toBe(true);
  });

  it("computes capped partial progress", () => {
    const views = listAchievementViews(progressWithCountries(40));
    const early = views.find((view) => view.id === "earlyExplorer");
    expect(early?.progress).toEqual({ current: 25, target: 25 });
    const half = views.find((view) => view.id === "halfWorld");
    expect(half?.progress).toEqual({ current: 40, target: 100 });
  });

  it("works with progress loaded from before achievements existed", () => {
    const progress = createInitialUserProgress();
    const views = listAchievementViews(progress);
    expect(views.every((view) => !view.unlocked)).toBe(true);
  });
});
