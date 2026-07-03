import { MASTERY_LEVELS, type MasteryLevel, type UserProgress } from "./progress.types";

const MASTERY_RANK: Record<MasteryLevel, number> = Object.fromEntries(
  MASTERY_LEVELS.map((level, index) => [level, index]),
) as Record<MasteryLevel, number>;

export function isMasteryAtLeast(level: MasteryLevel, minimum: MasteryLevel): boolean {
  return MASTERY_RANK[level] >= MASTERY_RANK[minimum];
}

/** Países considerados "aprendidos" para o progresso geral (Aprendido ou acima). */
export function countLearnedCountries(progress: UserProgress): number {
  return Object.values(progress.countries).filter((country) =>
    isMasteryAtLeast(country.masteryLevel, "learned"),
  ).length;
}

export function countLearnedCountriesIn(
  progress: UserProgress,
  countryIds: readonly string[],
): number {
  return countryIds.filter((id) => {
    const country = progress.countries[id];
    return country !== undefined && isMasteryAtLeast(country.masteryLevel, "learned");
  }).length;
}

export function countSeenCountries(progress: UserProgress): number {
  return Object.values(progress.countries).filter((country) => country.seenCount > 0).length;
}

export function listCountriesNeedingReview(progress: UserProgress): string[] {
  return Object.values(progress.countries)
    .filter((country) => country.needsReview)
    .map((country) => country.countryId);
}
