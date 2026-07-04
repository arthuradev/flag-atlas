import { isMasteryAtLeast } from "./progress.selectors";
import type { MasteryLevel, UserProgress } from "./progress.types";

export type OverallStats = {
  seenCount: number;
  learnedCount: number;
  masteredCount: number;
  reviewCount: number;
  /** Percentual 0–100 de acertos sobre todas as respostas registradas. */
  accuracyPercent: number;
  totalAnswers: number;
  completedSessions: number;
};

export function computeOverallStats(progress: UserProgress): OverallStats {
  let seenCount = 0;
  let learnedCount = 0;
  let masteredCount = 0;
  let reviewCount = 0;
  let correct = 0;
  let wrong = 0;

  for (const country of Object.values(progress.countries)) {
    if (country.seenCount > 0) {
      seenCount++;
    }
    if (isMasteryAtLeast(country.masteryLevel, "learned")) {
      learnedCount++;
    }
    if (isMasteryAtLeast(country.masteryLevel, "dominated")) {
      masteredCount++;
    }
    if (country.needsReview) {
      reviewCount++;
    }
    correct += country.correctCount;
    wrong += country.wrongCount;
  }

  const totalAnswers = correct + wrong;
  return {
    seenCount,
    learnedCount,
    masteredCount,
    reviewCount,
    accuracyPercent: totalAnswers === 0 ? 0 : Math.round((correct / totalAnswers) * 100),
    totalAnswers,
    completedSessions: progress.completedSessions,
  };
}

export type HardCountryStat = {
  countryId: string;
  wrongCount: number;
  correctCount: number;
};

/** Países com mais erros, empates decididos por menos acertos e id. */
export function listHardestCountries(progress: UserProgress, limit = 5): HardCountryStat[] {
  return Object.values(progress.countries)
    .filter((country) => country.wrongCount > 0)
    .map((country) => ({
      countryId: country.countryId,
      wrongCount: country.wrongCount,
      correctCount: country.correctCount,
    }))
    .sort(
      (a, b) =>
        b.wrongCount - a.wrongCount ||
        a.correctCount - b.correctCount ||
        a.countryId.localeCompare(b.countryId),
    )
    .slice(0, limit);
}

export type LowMasteryStat = {
  countryId: string;
  masteryPoints: number;
  masteryLevel: MasteryLevel;
};

/** Países já vistos com menor domínio (abaixo de Mestre). */
export function listLowestMasteryCountries(progress: UserProgress, limit = 5): LowMasteryStat[] {
  return Object.values(progress.countries)
    .filter((country) => country.seenCount > 0 && country.masteryLevel !== "master")
    .map((country) => ({
      countryId: country.countryId,
      masteryPoints: country.masteryPoints,
      masteryLevel: country.masteryLevel,
    }))
    .sort((a, b) => a.masteryPoints - b.masteryPoints || a.countryId.localeCompare(b.countryId))
    .slice(0, limit);
}

export type ConfusionStat = {
  countryId: string;
  confusedWithCountryId: string;
  count: number;
};

/** Pares "bandeira certa → país escolhido" mais confundidos. */
export function listTopConfusions(progress: UserProgress, limit = 5): ConfusionStat[] {
  const pairs: ConfusionStat[] = [];
  for (const country of Object.values(progress.countries)) {
    for (const [confusedWithCountryId, count] of Object.entries(country.confusions ?? {})) {
      pairs.push({ countryId: country.countryId, confusedWithCountryId, count });
    }
  }
  return pairs
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.countryId.localeCompare(b.countryId) ||
        a.confusedWithCountryId.localeCompare(b.confusedWithCountryId),
    )
    .slice(0, limit);
}
