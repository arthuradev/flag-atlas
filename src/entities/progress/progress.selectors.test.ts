import { describe, expect, it } from "vitest";
import { CONTINENTS } from "@/shared/data/continents";
import {
  countLearnedCountries,
  countLearnedCountriesIn,
  countSeenCountries,
  listCountriesNeedingReview,
} from "./progress.selectors";
import {
  createInitialCountryProgress,
  createInitialUserProgress,
  type MasteryLevel,
} from "./progress.types";

function progressWith(entries: Array<{ id: string; level: MasteryLevel; review?: boolean }>) {
  const progress = createInitialUserProgress();
  for (const entry of entries) {
    const country = createInitialCountryProgress(entry.id);
    country.masteryLevel = entry.level;
    country.seenCount = entry.level === "new" ? 0 : 1;
    country.needsReview = entry.review ?? false;
    progress.countries[entry.id] = country;
  }
  return progress;
}

describe("progress selectors", () => {
  it("counts learned countries from Aprendido upwards", () => {
    const progress = progressWith([
      { id: "br", level: "learned" },
      { id: "jp", level: "master" },
      { id: "fr", level: "dominated" },
      { id: "de", level: "recognized" },
      { id: "it", level: "new" },
    ]);
    expect(countLearnedCountries(progress)).toBe(3);
  });

  it("computes per-continent learned counts", () => {
    const america = CONTINENTS.find((continent) => continent.id === "america");
    if (!america) {
      throw new Error("missing america continent");
    }
    const progress = progressWith([
      { id: "br", level: "learned" },
      { id: "ar", level: "master" },
      { id: "jp", level: "master" },
    ]);
    expect(countLearnedCountriesIn(progress, america.countryIds)).toBe(2);
  });

  it("counts seen countries and review list", () => {
    const progress = progressWith([
      { id: "br", level: "recognized", review: true },
      { id: "jp", level: "learned" },
      { id: "it", level: "new" },
    ]);
    expect(countSeenCountries(progress)).toBe(2);
    expect(listCountriesNeedingReview(progress)).toEqual(["br"]);
  });
});
