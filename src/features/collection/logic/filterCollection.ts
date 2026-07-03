import type { ContinentId } from "@/entities/continent/continent.types";
import type { Country } from "@/entities/country/country.types";
import {
  MASTERY_LEVELS,
  type MasteryLevel,
  type UserProgress,
} from "@/entities/progress/progress.types";
import type { Locale } from "@/shared/i18n/locale";

export type CollectionStatusFilter = "all" | "seen" | "unseen" | "review";
export type CollectionSort = "name" | "mastery";

export type CollectionFilters = {
  search: string;
  continentId: ContinentId | "all";
  mastery: MasteryLevel | "all";
  status: CollectionStatusFilter;
  sort: CollectionSort;
};

export const DEFAULT_COLLECTION_FILTERS: CollectionFilters = {
  search: "",
  continentId: "all",
  mastery: "all",
  status: "all",
  sort: "name",
};

/** Busca sem acentos e sem diferenciar maiúsculas. */
export function normalizeSearchText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

function masteryRank(level: MasteryLevel): number {
  return MASTERY_LEVELS.indexOf(level);
}

export function filterCollection(
  countries: readonly Country[],
  progress: UserProgress,
  filters: CollectionFilters,
  locale: Locale,
): Country[] {
  const search = normalizeSearchText(filters.search);

  const filtered = countries.filter((country) => {
    if (filters.continentId !== "all" && country.continentId !== filters.continentId) {
      return false;
    }

    const countryProgress = progress.countries[country.id];
    const masteryLevel: MasteryLevel = countryProgress?.masteryLevel ?? "new";
    const seen = (countryProgress?.seenCount ?? 0) > 0;

    if (filters.mastery !== "all" && masteryLevel !== filters.mastery) {
      return false;
    }
    if (filters.status === "seen" && !seen) {
      return false;
    }
    if (filters.status === "unseen" && seen) {
      return false;
    }
    if (filters.status === "review" && countryProgress?.needsReview !== true) {
      return false;
    }
    if (search.length > 0 && !normalizeSearchText(country.names[locale]).includes(search)) {
      return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "mastery") {
      const rankDiff =
        masteryRank(progress.countries[b.id]?.masteryLevel ?? "new") -
        masteryRank(progress.countries[a.id]?.masteryLevel ?? "new");
      if (rankDiff !== 0) {
        return rankDiff;
      }
    }
    return a.names[locale].localeCompare(b.names[locale], locale);
  });
}
