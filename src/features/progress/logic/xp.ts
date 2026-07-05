export const XP_PER_CORRECT = 10;
export const XP_PER_PROMOTION = 5;
export const XP_STREAK_BONUS = 2;
export const STREAK_BONUS_THRESHOLD = 5;
export const MAX_LEVEL = 100;
const DEFAULT_XP_FOR_NEXT_LEVEL = 100;

const LEVEL_XP_TIERS: ReadonlyArray<{
  fromLevel: number;
  toLevel: number;
  xpForNextLevel: number;
}> = [
  { fromLevel: 1, toLevel: 10, xpForNextLevel: 100 },
  { fromLevel: 11, toLevel: 25, xpForNextLevel: 150 },
  { fromLevel: 26, toLevel: 50, xpForNextLevel: 250 },
  { fromLevel: 51, toLevel: 75, xpForNextLevel: 400 },
  { fromLevel: 76, toLevel: 99, xpForNextLevel: 600 },
];

type AnswerXpParams = {
  isCorrect: boolean;
  promoted: boolean;
  streakAfter: number;
};

/** XP não punitivo: acertos somam, erros não removem nada. */
export function computeAnswerXp({ isCorrect, promoted, streakAfter }: AnswerXpParams): number {
  if (!isCorrect) {
    return 0;
  }
  let xp = XP_PER_CORRECT;
  if (promoted) {
    xp += XP_PER_PROMOTION;
  }
  if (streakAfter >= STREAK_BONUS_THRESHOLD) {
    xp += XP_STREAK_BONUS;
  }
  return xp;
}

function normalizeXp(totalXp: number): number {
  return Math.max(0, Math.floor(Number.isFinite(totalXp) ? totalXp : 0));
}

export function getXpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(Number.isFinite(level) ? level : 1));
  if (safeLevel >= MAX_LEVEL) {
    return 0;
  }
  return (
    LEVEL_XP_TIERS.find((tier) => safeLevel >= tier.fromLevel && safeLevel <= tier.toLevel)
      ?.xpForNextLevel ?? DEFAULT_XP_FOR_NEXT_LEVEL
  );
}

export function getTotalXpRequiredForLevel(level: number): number {
  const targetLevel = Math.min(
    MAX_LEVEL,
    Math.max(1, Math.floor(Number.isFinite(level) ? level : 1)),
  );
  let total = 0;
  for (let currentLevel = 1; currentLevel < targetLevel; currentLevel++) {
    total += getXpRequiredForLevel(currentLevel);
  }
  return total;
}

export function computeLevel(totalXp: number): number {
  const safeXp = normalizeXp(totalXp);
  let level = 1;
  let remainingXp = safeXp;

  while (level < MAX_LEVEL) {
    const required = getXpRequiredForLevel(level);
    if (remainingXp < required) {
      break;
    }
    remainingXp -= required;
    level += 1;
  }

  return level;
}

export function getLevelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressRatio: number;
  isMaxLevel: boolean;
} {
  const safeXp = normalizeXp(totalXp);
  const level = computeLevel(safeXp);
  const isMaxLevel = level >= MAX_LEVEL;

  if (isMaxLevel) {
    return {
      level,
      currentLevelXp: 0,
      xpForNextLevel: 0,
      progressRatio: 1,
      isMaxLevel,
    };
  }

  const xpForNextLevel = getXpRequiredForLevel(level);
  const currentLevelXp = safeXp - getTotalXpRequiredForLevel(level);

  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    progressRatio: xpForNextLevel > 0 ? currentLevelXp / xpForNextLevel : 1,
    isMaxLevel,
  };
}

export function xpIntoCurrentLevel(totalXp: number): number {
  return getLevelProgress(totalXp).currentLevelXp;
}
