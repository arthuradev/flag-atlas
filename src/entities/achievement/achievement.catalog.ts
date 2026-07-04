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
function countMastered(progress: UserProgress): number {
  return Object.values(progress.countries).filter((country) =>
    isMasteryAtLeast(country.masteryLevel, "dominated"),
  ).length;
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
    emoji: continent.emoji,
    isUnlocked: ({ progress }) =>
      countLearnedCountriesIn(progress, continent.countryIds) >= target,
    getProgress: (progress) =>
      cappedProgress(countLearnedCountriesIn(progress, continent.countryIds), target),
  };
});

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  {
    id: "firstSteps",
    category: "session",
    emoji: "👣",
    isUnlocked: ({ progress }) => progress.completedSessions >= 1,
  },
  {
    id: "earlyExplorer",
    category: "progress",
    emoji: "🧭",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= 25,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), 25),
  },
  {
    id: "halfWorld",
    category: "progress",
    emoji: "🌗",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= 100,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), 100),
  },
  {
    id: "livingAtlas",
    category: "progress",
    emoji: "🌍",
    isUnlocked: ({ progress }) => countSeenCountries(progress) >= COUNTRIES.length,
    getProgress: (progress) => cappedProgress(countSeenCountries(progress), COUNTRIES.length),
  },
  {
    id: "firstMastery",
    category: "mastery",
    emoji: "🏅",
    isUnlocked: ({ progress }) => countMastered(progress) >= 1,
  },
  {
    id: "collector",
    category: "mastery",
    emoji: "🎒",
    isUnlocked: ({ progress }) => countMastered(progress) >= 25,
    getProgress: (progress) => cappedProgress(countMastered(progress), 25),
  },
  {
    id: "worldMaster",
    category: "mastery",
    emoji: "👑",
    isUnlocked: ({ progress }) => countMastered(progress) >= COUNTRIES.length,
    getProgress: (progress) => cappedProgress(countMastered(progress), COUNTRIES.length),
  },
  ...CONTINENT_EXPLORERS,
  {
    id: "flawless",
    category: "accuracy",
    emoji: "💯",
    isUnlocked: ({ sessionEvent }) =>
      sessionEvent !== undefined &&
      sessionEvent.accuracy === 100 &&
      sessionEvent.questionCount >= FLAWLESS_MIN_QUESTIONS,
  },
  {
    id: "hotStreak",
    category: "accuracy",
    emoji: "🔥",
    isUnlocked: ({ sessionEvent }) =>
      sessionEvent !== undefined && sessionEvent.bestStreak >= HOT_STREAK_TARGET,
  },
  {
    id: "honestReview",
    category: "review",
    emoji: "🔁",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.mode === "review",
  },
  {
    id: "vexillologist",
    category: "challenge",
    emoji: "🎭",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.mode === "similar",
  },
  {
    id: "globalTypist",
    category: "challenge",
    emoji: "⌨️",
    isUnlocked: ({ sessionEvent }) => sessionEvent?.questionType === "typing",
  },
  {
    id: "survivor",
    category: "survival",
    emoji: "🛡️",
    isUnlocked: ({ progress }) => progress.survival.bestScore >= SURVIVOR_TARGET_SCORE,
    getProgress: (progress) =>
      cappedProgress(progress.survival.bestScore, SURVIVOR_TARGET_SCORE),
  },
];

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
