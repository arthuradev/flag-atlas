import { describe, expect, it } from "vitest";
import {
  computeOverallStats,
  listHardestCountries,
  listLowestMasteryCountries,
  listTopConfusions,
} from "./progress.stats";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type MasteryLevel,
  type UserProgress,
} from "./progress.types";

function progressWith(
  entries: Array<{
    id: string;
    correct?: number;
    wrong?: number;
    points?: number;
    level?: MasteryLevel;
    review?: boolean;
    confusions?: Record<string, number>;
  }>,
): UserProgress {
  const progress = createInitialUserProgress();
  for (const entry of entries) {
    const country = createInitialCountryProgress(entry.id);
    country.correctCount = entry.correct ?? 0;
    country.wrongCount = entry.wrong ?? 0;
    country.seenCount = country.correctCount + country.wrongCount;
    country.masteryPoints = entry.points ?? 0;
    country.masteryLevel = entry.level ?? "new";
    country.needsReview = entry.review ?? false;
    if (entry.confusions) {
      country.confusions = entry.confusions;
    }
    progress.countries[entry.id] = country;
  }
  return progress;
}

describe("computeOverallStats", () => {
  it("returns zeros for empty progress", () => {
    const stats = computeOverallStats(createInitialUserProgress());
    expect(stats.seenCount).toBe(0);
    expect(stats.accuracyPercent).toBe(0);
    expect(stats.totalAnswers).toBe(0);
  });

  it("computes counts and overall accuracy", () => {
    const progress = progressWith([
      { id: "br", correct: 8, wrong: 2, level: "learned", points: 5 },
      { id: "jp", correct: 3, wrong: 3, level: "recognized", points: 2, review: true },
      { id: "fr", correct: 9, wrong: 0, level: "master", points: 10 },
      { id: "de", correct: 7, wrong: 1, level: "dominated", points: 7 },
    ]);
    progress.completedSessions = 4;
    const stats = computeOverallStats(progress);
    expect(stats.seenCount).toBe(4);
    expect(stats.learnedCount).toBe(3);
    expect(stats.masteredCount).toBe(2);
    expect(stats.reviewCount).toBe(1);
    expect(stats.totalAnswers).toBe(33);
    expect(stats.accuracyPercent).toBe(Math.round((27 / 33) * 100));
    expect(stats.completedSessions).toBe(4);
  });
});

describe("listHardestCountries", () => {
  it("sorts by wrong count with fewer corrects breaking ties", () => {
    const progress = progressWith([
      { id: "br", correct: 5, wrong: 1 },
      { id: "td", correct: 1, wrong: 4 },
      { id: "ro", correct: 3, wrong: 4 },
      { id: "fr", correct: 9, wrong: 0 },
    ]);
    const result = listHardestCountries(progress);
    expect(result.map((entry) => entry.countryId)).toEqual(["td", "ro", "br"]);
  });

  it("respects the limit", () => {
    const progress = progressWith([
      { id: "a1", wrong: 5 },
      { id: "a2", wrong: 4 },
      { id: "a3", wrong: 3 },
    ]);
    expect(listHardestCountries(progress, 2)).toHaveLength(2);
  });
});

describe("listLowestMasteryCountries", () => {
  it("lists seen countries with lowest points, excluding masters", () => {
    const progress = progressWith([
      { id: "br", correct: 1, points: 1, level: "recognized" },
      { id: "jp", correct: 1, points: 4, level: "learned" },
      { id: "fr", correct: 9, points: 10, level: "master" },
    ]);
    const result = listLowestMasteryCountries(progress);
    expect(result.map((entry) => entry.countryId)).toEqual(["br", "jp"]);
  });
});

describe("listTopConfusions", () => {
  it("flattens and sorts confusion pairs by count", () => {
    const progress = progressWith([
      { id: "td", wrong: 4, confusions: { ro: 3, sn: 1 } },
      { id: "sk", wrong: 2, confusions: { si: 2 } },
    ]);
    const result = listTopConfusions(progress);
    expect(result[0]).toEqual({ countryId: "td", confusedWithCountryId: "ro", count: 3 });
    expect(result[1]).toEqual({ countryId: "sk", confusedWithCountryId: "si", count: 2 });
    expect(result[2]).toEqual({ countryId: "td", confusedWithCountryId: "sn", count: 1 });
  });

  it("returns empty when there are no confusions", () => {
    expect(listTopConfusions(progressWith([{ id: "br", wrong: 1 }]))).toEqual([]);
  });
});
