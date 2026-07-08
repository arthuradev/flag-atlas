import type { AchievementSessionEvent } from "@/entities/achievement/achievement.types";

/**
 * Regras das Moedas Flaggo (Versão 4). Moedas são cosméticas, locais e sem
 * valor real: recompensam jogar, mas nunca alteram dificuldade, XP real,
 * domínio, aprendizado ou vantagem. Recompensas simples e balanceadas para
 * evitar farming exagerado.
 */

/** Moedas por concluir uma sessão comum. */
export const SESSION_COIN_REWARD = 10;
/** Bônus por concluir uma sessão sem erros. */
export const PERFECT_SESSION_BONUS = 5;
/** Moedas por concluir uma missão diária. */
export const MISSION_COIN_REWARD = 15;
/** Moedas por desbloquear uma conquista. */
export const ACHIEVEMENT_COIN_REWARD = 25;
/** Teto de moedas por uma partida de sobrevivência (evita farming). */
export const SURVIVAL_COIN_CAP = 30;

/** Sessão perfeita: precisa ter respostas e 100% de acerto. */
function isPerfectSession(event: AchievementSessionEvent): boolean {
  return event.questionCount > 0 && event.accuracy === 100;
}

/**
 * Moedas ganhas ao concluir uma sessão.
 * Sobrevivência recompensa pelo score, com teto; as demais dão a base
 * mais o bônus de sessão perfeita.
 */
export function computeSessionCoins(event: AchievementSessionEvent): number {
  if (event.mode === "survival") {
    return Math.min(SURVIVAL_COIN_CAP, Math.max(0, event.correctCount));
  }
  return SESSION_COIN_REWARD + (isPerfectSession(event) ? PERFECT_SESSION_BONUS : 0);
}

/** Moedas por conquistas recém-desbloqueadas (uma vez cada, no desbloqueio). */
export function computeAchievementCoins(unlockedCount: number): number {
  return Math.max(0, unlockedCount) * ACHIEVEMENT_COIN_REWARD;
}

/** Moedas por missões recém-concluídas (uma vez cada, na conclusão). */
export function computeMissionCoins(completedCount: number): number {
  return Math.max(0, completedCount) * MISSION_COIN_REWARD;
}
