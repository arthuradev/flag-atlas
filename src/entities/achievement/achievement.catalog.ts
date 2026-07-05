import {
  countLearnedCountriesIn,
  countSeenCountries,
  isMasteryAtLeast,
} from "@/entities/progress/progress.selectors";
import type { UserProgress } from "@/entities/progress/progress.types";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";
import type { AchievementDefinition, AchievementProgress } from "./achievement.types";

export const HOT_STREAK_TARGET = 10;
export const FLAWLESS_MIN_QUESTIONS = 5;
export const SURVIVOR_TARGET_SCORE = 15;

/** Países com domínio alto (Dominado ou Mestre). */
function countGoldOrBetter(progress: UserProgress): number {
  return Object.values(progress.countries).filter((country) =>
    isMasteryAtLeast(country.masteryLevel, "dominated"),
  ).length;
}

function countPlatinum(progress: UserProgress): number {
  return Object.values(progress.countries).filter((country) => country.masteryLevel === "master")
    .length;
}

function cappedProgress(current: number, target: number): AchievementProgress {
  return { current: Math.min(current, target), target };
}

/** Conquistas de continente: aprender metade do continente já é "relevante". */
const CONTINENT_EXPLORERS: AchievementDefinition[] = CONTINENTS.map((continent) => {
  const target = Math.ceil(continent.countryIds.length / 2);
  const capitalized = continent.id.charAt(0).toUpperCase() + continent.id.slice(1);
  return {
    id: `explorer${capitalized}`,
    category: "continent",
    icon: continent.icon,
    isUnlocked: ({ progress }) => countLearnedCountriesIn(progress, continent.countryIds) >= target,
    getProgress: (progress) =>
      cappedProgress(countLearnedCountriesIn(progress, continent.countryIds), target),
  };
});

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  {
    id: "firstSteps",
    category: "session",
    icon: "footprints",
    isUnlocked: ({ progress }) => progress.completedSessions >= 1,
  },
  {
    id: "earlyExplorer",
    category: "progress",
    icon: "compass",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= 25,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), 25),
  },
  {
    id: "halfWorld",
    category: "progress",
    icon: "globe-half",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= 100,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), 100),
  },
  {
    id: "livingAtlas",
    category: "progress",
    icon: "globe",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= COUNTRIES.length,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), COUNTRIES.length),
  },
  {
    id: "firstMastery",
    category: "mastery",
    icon: "medal",
    isUnlocked: ({ progress }) => countGoldOrBetter(progress) >= 1,
  },
  {
    id: "collector",
    category: "mastery",
    icon: "backpack",
    isUnlocked: ({ progress }) => countGoldOrBetter(progress) >= 25,
    getProgress: (progress) => cappedProgress(countGoldOrBetter(progress), 25),
  },
  {
    id: "firstPlatinum",
    category: "mastery",
    icon: "gem",
    isUnlocked: ({ progress }) => countPlatinum(progress) >= 1,
  },
  {
    id: "platinumCollector",
    category: "mastery",
    icon: "gems",
    isUnlocked: ({ progress }) => countPlatinum(progress) >= 10,
    getProgress: (progress) => cappedProgress(countPlatinum(progress), 10),
  },
  {
    id: "worldMaster",
    category: "mastery",
    icon: "crown",
    isUnlocked: ({ progress }) => countPlatinum(progress) >= COUNTRIES.length,
    getProgress: (progress) => cappedProgress(countPlatinum(progress), COUNTRIES.length),
  },
  ...CONTINENT_EXPLORERS,
  {
    id: "flawless",
    category: "accuracy",
    icon: "seal-check",
    isUnlocked: ({ sessionEvent }) =>
      sessionEvent !== undefined &&
      sessionEvent.accuracy === 100 &&
      sessionEvent.questionCount >= FLAWLESS_MIN_QUESTIONS,
  },
  {
    id: "hotStreak",
    category: "accuracy",
    icon: "flame",
    isUnlocked: ({ sessionEvent }) =>
      sessionEvent !== undefined && sessionEvent.bestStreak >= HOT_STREAK_TARGET,
  },
  {
    id: "honestReview",
    category: "review",
    icon: "refresh",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.mode === "review",
  },
  {
    id: "vexillologist",
    category: "challenge",
    icon: "layers",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.mode === "similar",
  },
  {
    id: "globalTypist",
    category: "challenge",
    icon: "keyboard",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.questionType === "typing",
  },
  {
    id: "survivor",
    category: "survival",
    icon: "shield",
    isUnlocked: ({ progress }) => progress.survival.bestScore >= SURVIVOR_TARGET_SCORE,
    getProgress: (progress) => cappedProgress(progress.survival.bestScore, SURVIVOR_TARGET_SCORE),
  },
];

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
