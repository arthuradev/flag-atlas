import type { TrainingSession } from "@/entities/session/session.types";

export const SURVIVAL_STARTING_LIVES = 3;
/** Teto de segurança para a fila de perguntas: nunca menor que o pool. */
export const SURVIVAL_MAX_QUESTIONS = 100;

export function countWrongAnswers(session: TrainingSession): number {
  return session.answers.filter((answer) => !answer.isCorrect).length;
}

export function getSurvivalLivesRemaining(session: TrainingSession): number {
  return Math.max(0, SURVIVAL_STARTING_LIVES - countWrongAnswers(session));
}

export function isSurvivalOver(session: TrainingSession): boolean {
  return getSurvivalLivesRemaining(session) <= 0;
}
