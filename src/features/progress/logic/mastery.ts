import type { CountryProgress, MasteryLevel } from "@/entities/progress/progress.types";

export const MAX_MASTERY_POINTS = 10;

/** Faixas de pontos internos por nível público, conforme .specs/DATA_MODEL.md. */
export function masteryLevelForPoints(points: number): MasteryLevel {
  if (points <= 0) {
    return "new";
  }
  if (points <= 2) {
    return "recognized";
  }
  if (points <= 5) {
    return "learned";
  }
  if (points <= 8) {
    return "dominated";
  }
  return "master";
}

function clampPoints(points: number): number {
  return Math.min(MAX_MASTERY_POINTS, Math.max(0, points));
}

/** O erro anterior ainda é "recente" se não houve acerto depois dele. */
function hasRecentWrong(progress: CountryProgress): boolean {
  if (progress.wrongCount === 0 || !progress.lastWrongAt) {
    return false;
  }
  if (!progress.lastCorrectAt) {
    return true;
  }
  return progress.lastWrongAt > progress.lastCorrectAt;
}

type ApplyAnswerParams = {
  isCorrect: boolean;
  answeredAt: string;
  /** País escolhido por engano (múltipla escolha): registrado como confusão. */
  confusedWithCountryId?: string;
};

/**
 * Atualiza o progresso de um país após uma resposta.
 *
 * Regras não punitivas (.specs/PRODUCT_DECISIONS.md):
 * - acerto: +1 ponto e sai da revisão;
 * - erro único: não remove ponto, apenas marca revisão;
 * - dois erros recentes seguidos: -1 ponto.
 */
export function applyAnswerToCountryProgress(
  previous: CountryProgress,
  { isCorrect, answeredAt, confusedWithCountryId }: ApplyAnswerParams,
): CountryProgress {
  if (isCorrect) {
    const points = clampPoints(previous.masteryPoints + 1);
    const streak = previous.currentCorrectStreak + 1;
    return {
      ...previous,
      seenCount: previous.seenCount + 1,
      correctCount: previous.correctCount + 1,
      currentCorrectStreak: streak,
      bestCorrectStreak: Math.max(previous.bestCorrectStreak, streak),
      masteryPoints: points,
      masteryLevel: masteryLevelForPoints(points),
      needsReview: false,
      lastSeenAt: answeredAt,
      lastCorrectAt: answeredAt,
    };
  }

  const points = hasRecentWrong(previous)
    ? clampPoints(previous.masteryPoints - 1)
    : previous.masteryPoints;
  const next: CountryProgress = {
    ...previous,
    seenCount: previous.seenCount + 1,
    wrongCount: previous.wrongCount + 1,
    currentCorrectStreak: 0,
    masteryPoints: points,
    masteryLevel: masteryLevelForPoints(points),
    needsReview: true,
    lastSeenAt: answeredAt,
    lastWrongAt: answeredAt,
  };
  if (confusedWithCountryId && confusedWithCountryId !== previous.countryId) {
    const confusions = { ...(previous.confusions ?? {}) };
    confusions[confusedWithCountryId] = (confusions[confusedWithCountryId] ?? 0) + 1;
    next.confusions = confusions;
  }
  return next;
}
