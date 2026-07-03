import { describe, expect, it } from "vitest";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type UserProgress,
} from "@/entities/progress/progress.types";
import { COUNTRIES } from "@/shared/data/countries";
import { createRng } from "@/shared/utils/rng";
import { selectSessionCountries } from "./selectSessionCountries";

const OCEANIA = COUNTRIES.filter((country) => country.continentId === "oceania");

function progressWith(
  entries: Array<{ id: string; seen?: number; points?: number; review?: boolean }>,
): UserProgress {
  const progress = createInitialUserProgress();
  for (const entry of entries) {
    const country = createInitialCountryProgress(entry.id);
    country.seenCount = entry.seen ?? 1;
    country.masteryPoints = entry.points ?? 1;
    country.needsReview = entry.review ?? false;
    progress.countries[entry.id] = country;
  }
  return progress;
}

describe("selectSessionCountries", () => {
  it("returns the requested size without repeats when the pool is large enough", () => {
    const result = selectSessionCountries({
      pool: COUNTRIES,
      progress: createInitialUserProgress(),
      size: 10,
      rng: createRng(42),
    });
    expect(result).toHaveLength(10);
    expect(new Set(result).size).toBe(10);
  });

  it("only picks countries from the given pool", () => {
    const result = selectSessionCountries({
      pool: OCEANIA,
      progress: createInitialUserProgress(),
      size: 10,
      rng: createRng(7),
    });
    const oceaniaIds = new Set(OCEANIA.map((country) => country.id));
    for (const id of result) {
      expect(oceaniaIds.has(id)).toBe(true);
    }
  });

  it("allows repeats only when the pool is smaller than the session", () => {
    const result = selectSessionCountries({
      pool: OCEANIA,
      progress: createInitialUserProgress(),
      size: 20,
      rng: createRng(7),
    });
    expect(result).toHaveLength(20);
    expect(new Set(result).size).toBe(OCEANIA.length);
  });

  it("includes countries marked for review when there is history", () => {
    const reviewIds = ["br", "jp", "fr", "de"];
    const progress = progressWith([
      ...reviewIds.map((id) => ({ id, review: true })),
      { id: "it", points: 4 },
      { id: "es", points: 5 },
    ]);
    const result = selectSessionCountries({
      pool: COUNTRIES,
      progress,
      size: 10,
      rng: createRng(1),
    });
    const included = reviewIds.filter((id) => result.includes(id));
    expect(included.length).toBe(reviewIds.length);
  });

  it("keeps discovering new countries even with history", () => {
    const progress = progressWith([
      { id: "br", review: true },
      { id: "jp", points: 2 },
    ]);
    const result = selectSessionCountries({
      pool: COUNTRIES,
      progress,
      size: 10,
      rng: createRng(3),
    });
    const freshPicked = result.filter((id) => progress.countries[id] === undefined);
    expect(freshPicked.length).toBeGreaterThan(0);
  });

  it("is deterministic for the same seed", () => {
    const a = selectSessionCountries({
      pool: COUNTRIES,
      progress: createInitialUserProgress(),
      size: 10,
      rng: createRng(99),
    });
    const b = selectSessionCountries({
      pool: COUNTRIES,
      progress: createInitialUserProgress(),
      size: 10,
      rng: createRng(99),
    });
    expect(a).toEqual(b);
  });

  it("returns empty for an empty pool", () => {
    expect(
      selectSessionCountries({
        pool: [],
        progress: createInitialUserProgress(),
        size: 10,
        rng: createRng(1),
      }),
    ).toEqual([]);
  });
});
