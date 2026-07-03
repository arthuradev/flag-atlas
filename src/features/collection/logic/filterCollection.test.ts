import { describe, expect, it } from "vitest";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type MasteryLevel,
} from "@/entities/progress/progress.types";
import { COUNTRIES } from "@/shared/data/countries";
import {
  DEFAULT_COLLECTION_FILTERS,
  filterCollection,
  normalizeSearchText,
} from "./filterCollection";

function progressWith(entries: Array<{ id: string; level: MasteryLevel; review?: boolean }>) {
  const progress = createInitialUserProgress();
  for (const entry of entries) {
    const country = createInitialCountryProgress(entry.id);
    country.masteryLevel = entry.level;
    country.seenCount = 1;
    country.needsReview = entry.review ?? false;
    progress.countries[entry.id] = country;
  }
  return progress;
}

describe("normalizeSearchText", () => {
  it("ignores case and accents", () => {
    expect(normalizeSearchText("São Tomé")).toBe("sao tome");
    expect(normalizeSearchText("  TURQUIA ")).toBe("turquia");
  });
});

describe("filterCollection", () => {
  const empty = createInitialUserProgress();

  it("returns all countries with default filters", () => {
    const result = filterCollection(COUNTRIES, empty, DEFAULT_COLLECTION_FILTERS, "pt-BR");
    expect(result).toHaveLength(195);
  });

  it("searches by localized name without accents", () => {
    const result = filterCollection(
      COUNTRIES,
      empty,
      { ...DEFAULT_COLLECTION_FILTERS, search: "japao" },
      "pt-BR",
    );
    expect(result.map((country) => country.id)).toEqual(["jp"]);
  });

  it("filters by continent", () => {
    const result = filterCollection(
      COUNTRIES,
      empty,
      { ...DEFAULT_COLLECTION_FILTERS, continentId: "oceania" },
      "pt-BR",
    );
    expect(result).toHaveLength(14);
  });

  it("filters by mastery level", () => {
    const progress = progressWith([
      { id: "br", level: "master" },
      { id: "jp", level: "learned" },
    ]);
    const result = filterCollection(
      COUNTRIES,
      progress,
      { ...DEFAULT_COLLECTION_FILTERS, mastery: "master" },
      "pt-BR",
    );
    expect(result.map((country) => country.id)).toEqual(["br"]);
  });

  it("filters by seen, unseen and review status", () => {
    const progress = progressWith([
      { id: "br", level: "recognized" },
      { id: "jp", level: "recognized", review: true },
    ]);
    const seen = filterCollection(
      COUNTRIES,
      progress,
      { ...DEFAULT_COLLECTION_FILTERS, status: "seen" },
      "pt-BR",
    );
    expect(seen.map((country) => country.id).sort()).toEqual(["br", "jp"]);

    const unseen = filterCollection(
      COUNTRIES,
      progress,
      { ...DEFAULT_COLLECTION_FILTERS, status: "unseen" },
      "pt-BR",
    );
    expect(unseen).toHaveLength(193);

    const review = filterCollection(
      COUNTRIES,
      progress,
      { ...DEFAULT_COLLECTION_FILTERS, status: "review" },
      "pt-BR",
    );
    expect(review.map((country) => country.id)).toEqual(["jp"]);
  });

  it("sorts by mastery with name as tiebreaker", () => {
    const progress = progressWith([
      { id: "jp", level: "master" },
      { id: "br", level: "learned" },
    ]);
    const result = filterCollection(
      COUNTRIES,
      progress,
      { ...DEFAULT_COLLECTION_FILTERS, sort: "mastery" },
      "pt-BR",
    );
    expect(result[0]?.id).toBe("jp");
    expect(result[1]?.id).toBe("br");
  });

  it("sorts by localized name by default", () => {
    const result = filterCollection(COUNTRIES, empty, DEFAULT_COLLECTION_FILTERS, "pt-BR");
    const names = result.map((country) => country.names["pt-BR"]);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "pt-BR"));
    expect(names).toEqual(sorted);
  });
});
