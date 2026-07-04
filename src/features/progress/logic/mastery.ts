import type { CountryProgress, MasteryLevel } from "@/entities/progress/progress.types";
import type { QuestionType, SessionMode } from "@/entities/session/session.types";
import { getLocalDateKey, isDateKey } from "@/shared/utils/dateKey";

export const MASTERY_SYSTEM_VERSION = 2;
export const MAX_MASTERY_POINTS = 100;
export const CORRECT_DATE_KEY_LIMIT = 30;

export const MASTER_MIN_POINTS = 85;
export const MASTER_MIN_CORRECT = 20;
export const MASTER_MIN_ACCURACY_PERCENT = 80;
export const MASTER_MIN_CORRECT_DAYS = 3;
export const MASTER_MIN_TYPED_CORRECT = 2;
export const MASTER_MIN_REVIEW_CORRECT = 2;

export type MasteryBadgeTier = "none" | "bronze" | "silver" | "gold" | "platinum";

export type MasteryRequirementKey =
  | "points"
  | "correctCount"
  | "accuracy"
  | "correctDays"
  | "typedCorrect"
  | "reviewCorrect"
  | "needsReview"
  | "recentWrong";

export const MASTERY_BADGE_META: Record<
  MasteryLevel,
  {
    tier: MasteryBadgeTier;
    minPoints: number;
    nextPoints?: number;
  }
> = {
  new: { tier: "none", minPoints: 0, nextPoints: 1 },
  recognized: { tier: "bronze", minPoints: 1, nextPoints: 20 },
  learned: { tier: "silver", minPoints: 20, nextPoints: 50 },
  dominated: { tier: "gold", minPoints: 50, nextPoints: MASTER_MIN_POINTS },
  master: { tier: "platinum", minPoints: MASTER_MIN_POINTS },
};

/**
 * Faixas de pontos do Mastery 2.0.
 *
 * Pontos sozinhos nunca concedem "master": 85+ é apenas candidato a
 * Platina. A decisão final passa por deriveMasteryLevel().
 */
export function masteryLevelForPoints(points: number): MasteryLevel {
  if (points <= 0) {
    return "new";
  }
  if (points <= 19) {
    return "recognized";
  }
  if (points <= 49) {
    return "learned";
  }
  return "dominated";
}

function clampPoints(points: number): number {
  return Math.min(MAX_MASTERY_POINTS, Math.max(0, Math.floor(points)));
}

/** O erro anterior ainda é "recente" se não houve acerto depois dele. */
export function hasRecentWrong(progress: CountryProgress): boolean {
  if (progress.wrongCount === 0 || !progress.lastWrongAt) {
    return false;
  }
  if (!progress.lastCorrectAt) {
    return true;
  }
  return progress.lastWrongAt > progress.lastCorrectAt;
}

function accuracyPercent(progress: CountryProgress): number {
  const total = progress.correctCount + progress.wrongCount;
  return total === 0 ? 0 : Math.round((progress.correctCount / total) * 100);
}

function correctReviewEvidence(progress: CountryProgress): number {
  return Math.max(progress.reviewCorrectCount ?? 0, progress.successfulReviews ?? 0);
}

export function getMasteryRequirementStatus(progress: CountryProgress): {
  eligible: boolean;
  missing: MasteryRequirementKey[];
} {
  const missing: MasteryRequirementKey[] = [];
  if (progress.masteryPoints < MASTER_MIN_POINTS) {
    missing.push("points");
  }
  if (progress.correctCount < MASTER_MIN_CORRECT) {
    missing.push("correctCount");
  }
  if (accuracyPercent(progress) < MASTER_MIN_ACCURACY_PERCENT) {
    missing.push("accuracy");
  }
  if ((progress.correctDateKeys?.length ?? 0) < MASTER_MIN_CORRECT_DAYS) {
    missing.push("correctDays");
  }
  if ((progress.typedCorrectCount ?? 0) < MASTER_MIN_TYPED_CORRECT) {
    missing.push("typedCorrect");
  }
  if (correctReviewEvidence(progress) < MASTER_MIN_REVIEW_CORRECT) {
    missing.push("reviewCorrect");
  }
  if (progress.needsReview) {
    missing.push("needsReview");
  }
  if (hasRecentWrong(progress)) {
    missing.push("recentWrong");
  }
  return { eligible: missing.length === 0, missing };
}

export function deriveMasteryLevel(progress: CountryProgress): MasteryLevel {
  const pointLevel = masteryLevelForPoints(progress.masteryPoints);
  if (progress.masteryPoints < MASTER_MIN_POINTS) {
    return pointLevel;
  }
  return getMasteryRequirementStatus(progress).eligible ? "master" : "dominated";
}

export function pointsUntilNextBadge(progress: CountryProgress): number {
  if (progress.masteryLevel === "master") {
    return 0;
  }
  const nextPoints = MASTERY_BADGE_META[progress.masteryLevel].nextPoints;
  if (nextPoints === undefined) {
    return 0;
  }
  return Math.max(0, nextPoints - progress.masteryPoints);
}

function localDateKeyForAnswer(answeredAt: string, localDateKey?: string): string {
  if (isDateKey(localDateKey)) {
    return localDateKey;
  }
  const date = new Date(answeredAt);
  return Number.isNaN(date.getTime()) ? getLocalDateKey() : getLocalDateKey(date);
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const [year = 1970, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function appendCorrectDateKey(keys: readonly string[] | undefined, dateKey: string): string[] {
  const unique = new Set((keys ?? []).filter(isDateKey));
  unique.add(dateKey);
  return [...unique].sort().slice(-CORRECT_DATE_KEY_LIMIT);
}

function isReviewDue(progress: CountryProgress, localDateKey: string): boolean {
  return (
    progress.needsReview ||
    (isDateKey(progress.nextReviewAt) && progress.nextReviewAt <= localDateKey)
  );
}

function pointsForCorrectAnswer(
  mode: SessionMode,
  questionType: QuestionType,
  wasDueForReview: boolean,
): number {
  let points = 2;
  if (questionType === "typing") {
    points = 4;
  }
  if (mode === "review") {
    points = 5;
  } else if (mode === "similar") {
    points = 4;
  } else if (mode === "survival") {
    points = 2;
  }
  return points + (wasDueForReview ? 3 : 0);
}

function pointsForWrongAnswer(progress: CountryProgress): number {
  const level = deriveMasteryLevel(progress);
  const baseLoss =
    level === "master"
      ? 8
      : level === "dominated"
        ? 4
        : level === "learned"
          ? 2
          : level === "recognized"
            ? 1
            : 0;
  return baseLoss + (hasRecentWrong(progress) ? 1 : 0);
}

function reviewIntervalDays(level: MasteryLevel): number {
  if (level === "master") {
    return 14;
  }
  if (level === "dominated") {
    return 7;
  }
  if (level === "learned") {
    return 3;
  }
  return 1;
}

type ApplyAnswerParams = {
  isCorrect: boolean;
  answeredAt: string;
  localDateKey?: string;
  mode?: SessionMode;
  questionType?: QuestionType;
  /** País escolhido por engano (múltipla escolha): registrado como confusão. */
  confusedWithCountryId?: string;
};

/**
 * Atualiza o progresso de um país após uma resposta.
 *
 * Mastery 2.0 mantém o erro como convite à revisão, mas dá mais peso a
 * evidências melhores: digitação, revisão vencida e bandeiras parecidas.
 */
export function applyAnswerToCountryProgress(
  previous: CountryProgress,
  {
    isCorrect,
    answeredAt,
    localDateKey,
    mode = "continue",
    questionType = "choice",
    confusedWithCountryId,
  }: ApplyAnswerParams,
): CountryProgress {
  const answerDateKey = localDateKeyForAnswer(answeredAt, localDateKey);

  if (isCorrect) {
    const wasDueForReview = isReviewDue(previous, answerDateKey);
    const points = clampPoints(
      previous.masteryPoints + pointsForCorrectAnswer(mode, questionType, wasDueForReview),
    );
    const streak = previous.currentCorrectStreak + 1;
    const next: CountryProgress = {
      ...previous,
      masterySystemVersion: MASTERY_SYSTEM_VERSION,
      seenCount: previous.seenCount + 1,
      correctCount: previous.correctCount + 1,
      currentCorrectStreak: streak,
      bestCorrectStreak: Math.max(previous.bestCorrectStreak, streak),
      masteryPoints: points,
      needsReview: false,
      correctDateKeys: appendCorrectDateKey(previous.correctDateKeys, answerDateKey),
      typedCorrectCount: (previous.typedCorrectCount ?? 0) + (questionType === "typing" ? 1 : 0),
      choiceCorrectCount: (previous.choiceCorrectCount ?? 0) + (questionType === "choice" ? 1 : 0),
      reviewCorrectCount: (previous.reviewCorrectCount ?? 0) + (mode === "review" ? 1 : 0),
      similarCorrectCount: (previous.similarCorrectCount ?? 0) + (mode === "similar" ? 1 : 0),
      survivalCorrectCount: (previous.survivalCorrectCount ?? 0) + (mode === "survival" ? 1 : 0),
      successfulReviews:
        (previous.successfulReviews ?? 0) + (mode === "review" || wasDueForReview ? 1 : 0),
      lastSeenAt: answeredAt,
      lastCorrectAt: answeredAt,
      lastMasteryMode: mode,
      lastMasteryQuestionType: questionType,
    };
    next.masteryLevel = deriveMasteryLevel(next);
    next.nextReviewAt = addDaysToDateKey(answerDateKey, reviewIntervalDays(next.masteryLevel));
    if (next.masteryLevel !== previous.masteryLevel) {
      next.lastPromotionAt = answeredAt;
    }
    return next;
  }

  const points = clampPoints(previous.masteryPoints - pointsForWrongAnswer(previous));
  const next: CountryProgress = {
    ...previous,
    masterySystemVersion: MASTERY_SYSTEM_VERSION,
    seenCount: previous.seenCount + 1,
    wrongCount: previous.wrongCount + 1,
    currentCorrectStreak: 0,
    masteryPoints: points,
    needsReview: true,
    nextReviewAt: answerDateKey,
    lastSeenAt: answeredAt,
    lastWrongAt: answeredAt,
  };
  next.masteryLevel = deriveMasteryLevel(next);
  if (confusedWithCountryId && confusedWithCountryId !== previous.countryId) {
    const confusions = { ...(previous.confusions ?? {}) };
    confusions[confusedWithCountryId] = (confusions[confusedWithCountryId] ?? 0) + 1;
    next.confusions = confusions;
  }
  return next;
}
