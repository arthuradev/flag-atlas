export const XP_PER_CORRECT = 10;
export const XP_PER_PROMOTION = 5;
export const XP_STREAK_BONUS = 2;
export const STREAK_BONUS_THRESHOLD = 5;
export const XP_PER_LEVEL = 100;

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

export function computeLevel(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function xpIntoCurrentLevel(totalXp: number): number {
  return Math.max(0, totalXp) % XP_PER_LEVEL;
}
