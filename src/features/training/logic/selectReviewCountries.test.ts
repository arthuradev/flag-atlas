import { describe, expect, it } from "vitest";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { COUNTRIES } from "@/shared/data/countries";
import { createRng } from "@/shared/utils/rng";
import { selectReviewCountries } from "./selectReviewCountries";

function progressWith(
  entries: Array<{
    id: string;
    seen?: number;
    points?: number;
    wrong?: number;
    review?: boolean;
    nextReviewAt?: string;
  }>,
): UserProgress {
  const progress = createInitialUserProgress();
  for (const entry of entries) {
    const country = createInitialCountryProgress(entry.id);
    country.seenCount = entry.seen ?? 1;
    country.masteryPoints = entry.points ?? 1;
    country.wrongCount = entry.wrong ?? 0;
    country.needsReview = entry.review ?? false;
    country.nextReviewAt = entry.nextReviewAt;
    progress.countries[entry.id] = country;
  }
  return progress;
}

describe("selectReviewCountries", () => {
  it("returns empty when there is no history", () => {
    const result = selectReviewCountries({
      pool: COUNTRIES,
      progress: createInitialUserProgress(),
      size: 10,
      rng: createRng(1),
    });
    expect(result).toEqual([]);
  });

  it("prioritizes countries marked for review", () => {
    const progress = progressWith([
      { id: "td", review: true },
      { id: "ro", review: true },
      { id: "br", points: 9 },
      { id: "jp", points: 8 },
      { id: "fr", points: 7 },
    ]);
    const result = selectReviewCountries({ pool: COUNTRIES, progress, size: 2, rng: createRng(2) });
    expect(result.sort()).toEqual(["ro", "td"]);
  });

  it("fills with low mastery and high wrong-count countries when review is short", () => {
    const progress = progressWith([
      { id: "td", review: true },
      { id: "br", points: 9 },
      { id: "jp", points: 1, wrong: 3 },
      { id: "fr", points: 1, wrong: 1 },
    ]);
    const result = selectReviewCountries({ pool: COUNTRIES, progress, size: 3, rng: createRng(3) });
    expect(result).toHaveLength(3);
    expect(result).toContain("td");
    expect(result).toContain("jp");
    // jp (1 ponto, 3 erros) entra antes de br (9 pontos).
    expect(result).not.toContain("br");
  });

  it("includes countries whose spaced review is due", () => {
    const progress = progressWith([
      { id: "td", nextReviewAt: "2000-01-01" },
      { id: "ro", nextReviewAt: "2999-01-01", points: 1 },
    ]);
    const result = selectReviewCountries({ pool: COUNTRIES, progress, size: 1, rng: createRng(6) });
    expect(result).toEqual(["td"]);
  });

  it("does not treat future nextReviewAt as priority", () => {
    const progress = progressWith([
      { id: "td", nextReviewAt: "2999-01-01", points: 90 },
      { id: "ro", points: 1 },
    ]);
    const result = selectReviewCountries({ pool: COUNTRIES, progress, size: 1, rng: createRng(7) });
    expect(result).not.toEqual(["td"]);
  });

  it("schedules a future review and increments successful reviews after a correct review", () => {
    const after = applyAnswerToCountryProgress(
      { ...createInitialCountryProgress("td"), needsReview: true, nextReviewAt: "2026-07-03" },
      {
        isCorrect: true,
        answeredAt: "2026-07-03T10:00:00.000Z",
        localDateKey: "2026-07-03",
        mode: "review",
      },
    );
    expect(after.needsReview).toBe(false);
    expect(after.nextReviewAt).toBe("2026-07-04");
    expect(after.successfulReviews).toBe(1);
  });

  it("does not repeat countries and shortens the session when material is scarce", () => {
    const progress = progressWith([
      { id: "td", review: true },
      { id: "ro", review: true },
      { id: "br", points: 2 },
    ]);
    const result = selectReviewCountries({
      pool: COUNTRIES,
      progress,
      size: 10,
      rng: createRng(4),
    });
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it("does not include unseen countries", () => {
    const progress = progressWith([{ id: "td", review: true }]);
    const result = selectReviewCountries({
      pool: COUNTRIES,
      progress,
      size: 10,
      rng: createRng(5),
    });
    expect(result).toEqual(["td"]);
  });

  it("is deterministic for the same seed", () => {
    const progress = progressWith([
      { id: "td", review: true },
      { id: "ro", review: true },
      { id: "br", points: 1 },
      { id: "jp", points: 2 },
      { id: "fr", points: 3 },
    ]);
    const a = selectReviewCountries({ pool: COUNTRIES, progress, size: 4, rng: createRng(42) });
    const b = selectReviewCountries({ pool: COUNTRIES, progress, size: 4, rng: createRng(42) });
    expect(a).toEqual(b);
  });
});
