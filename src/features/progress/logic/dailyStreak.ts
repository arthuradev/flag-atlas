import type { DailyStreak } from "@/entities/progress/progress.types";
import { dateKeyDiffInDays } from "@/shared/utils/dateKey";

export const MAX_REST_DAYS = 1;
/** A cada 7 dias ativos seguidos, o descanso é recarregado. */
export const REST_RECHARGE_EVERY = 7;

export type DailyStreakUpdate = {
  streak: DailyStreak;
  /** true quando esta conclusão fez o dia de hoje contar (primeira do dia). */
  countedToday: boolean;
  usedRestDay: boolean;
};

/**
 * Registra um dia ativo (o usuário completou uma sessão hoje).
 *
 * Regras saudáveis (.specs/PRODUCT_DECISIONS.md — erro ensina, não pune):
 * - o mesmo dia nunca conta duas vezes;
 * - dia seguinte incrementa;
 * - um único dia pulado é coberto pelo descanso, se disponível;
 * - pausas maiores recomeçam do 1 sem drama, com o descanso devolvido;
 * - a cada 7 dias ativos o descanso recarrega.
 */
export function registerActiveDay(streak: DailyStreak, todayKey: string): DailyStreakUpdate {
  if (!streak.lastActiveDate) {
    return {
      streak: withBest({ ...streak, currentStreak: 1, lastActiveDate: todayKey }),
      countedToday: true,
      usedRestDay: false,
    };
  }

  const diff = dateKeyDiffInDays(streak.lastActiveDate, todayKey);

  // Mesmo dia (ou relógio andando para trás): hoje já contou, nada muda.
  if (Number.isNaN(diff) || diff <= 0) {
    return { streak, countedToday: false, usedRestDay: false };
  }

  if (diff === 1) {
    return {
      streak: withBest(
        recharge({
          ...streak,
          currentStreak: streak.currentStreak + 1,
          lastActiveDate: todayKey,
        }),
      ),
      countedToday: true,
      usedRestDay: false,
    };
  }

  // Exatamente 1 dia pulado com descanso disponível: o descanso cobre.
  if (diff === 2 && streak.restDaysAvailable > 0) {
    return {
      streak: withBest(
        recharge({
          ...streak,
          currentStreak: streak.currentStreak + 1,
          lastActiveDate: todayKey,
          restDaysAvailable: streak.restDaysAvailable - 1,
        }),
      ),
      countedToday: true,
      usedRestDay: true,
    };
  }

  // Pausa maior: recomeça leve, sem culpa e com o descanso de volta.
  return {
    streak: withBest({
      ...streak,
      currentStreak: 1,
      lastActiveDate: todayKey,
      restDaysAvailable: MAX_REST_DAYS,
    }),
    countedToday: true,
    usedRestDay: false,
  };
}

function recharge(streak: DailyStreak): DailyStreak {
  if (streak.currentStreak > 0 && streak.currentStreak % REST_RECHARGE_EVERY === 0) {
    return { ...streak, restDaysAvailable: MAX_REST_DAYS };
  }
  return streak;
}

function withBest(streak: DailyStreak): DailyStreak {
  return { ...streak, bestStreak: Math.max(streak.bestStreak, streak.currentStreak) };
}

export type DailyStreakStatus = "none" | "activeToday" | "alive" | "expired";

/** Como a sequência deve ser exibida hoje, sem alterá-la. */
export function getDailyStreakStatus(streak: DailyStreak, todayKey: string): DailyStreakStatus {
  if (!streak.lastActiveDate || streak.currentStreak <= 0) {
    return "none";
  }
  const diff = dateKeyDiffInDays(streak.lastActiveDate, todayKey);
  if (Number.isNaN(diff)) {
    return "none";
  }
  if (diff <= 0) {
    return "activeToday";
  }
  if (diff === 1 || (diff === 2 && streak.restDaysAvailable > 0)) {
    return "alive";
  }
  return "expired";
}
