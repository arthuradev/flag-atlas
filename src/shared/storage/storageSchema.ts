import {
  type CountryProgress,
  createInitialDailyStreak,
  createInitialSurvivalStats,
  createInitialUserProgress,
  type DailyStreak,
  type SurvivalStats,
  type UserProgress,
} from "@/entities/progress/progress.types";
import {
  type AppSettings,
  DEFAULT_SETTINGS,
  SESSION_SIZES,
  type SessionSize,
  THEME_PREFERENCES,
  type ThemePreference,
} from "@/entities/settings/settings.types";
import { MAX_REST_DAYS } from "@/features/progress/logic/dailyStreak";
import { MAX_MASTERY_POINTS, masteryLevelForPoints } from "@/features/progress/logic/mastery";
import { computeLevel } from "@/features/progress/logic/xp";
import { isLocale } from "@/shared/i18n/locale";
import { isDateKey } from "@/shared/utils/dateKey";

export const SETTINGS_SCHEMA_VERSION = 1;
export const PROGRESS_SCHEMA_VERSION = 1;

export type VersionedEnvelope<T> = {
  schemaVersion: number;
  data: T;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normaliza dados de configurações vindos do localStorage.
 * Campos inválidos ou ausentes voltam ao padrão; nunca lança.
 */
export function normalizeSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return { ...DEFAULT_SETTINGS };
  }
  return {
    locale: isLocale(value.locale) ? value.locale : DEFAULT_SETTINGS.locale,
    theme: THEME_PREFERENCES.includes(value.theme as ThemePreference)
      ? (value.theme as ThemePreference)
      : DEFAULT_SETTINGS.theme,
    soundEnabled:
      typeof value.soundEnabled === "boolean" ? value.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
    volume:
      typeof value.volume === "number" && Number.isFinite(value.volume)
        ? Math.min(1, Math.max(0, value.volume))
        : DEFAULT_SETTINGS.volume,
    reduceMotion:
      typeof value.reduceMotion === "boolean" ? value.reduceMotion : DEFAULT_SETTINGS.reduceMotion,
    defaultSessionSize: SESSION_SIZES.includes(value.defaultSessionSize as SessionSize)
      ? (value.defaultSessionSize as SessionSize)
      : DEFAULT_SETTINGS.defaultSessionSize,
  };
}

/**
 * Normaliza o progresso do usuário vindo do localStorage.
 * Dados corrompidos ou inválidos são descartados com fallback seguro;
 * o progresso local é tratado como dado não confiável (.specs/SECURITY.md).
 */
export function normalizeUserProgress(value: unknown): UserProgress {
  if (!isRecord(value)) {
    return createInitialUserProgress();
  }

  const countries: Record<string, CountryProgress> = {};
  if (isRecord(value.countries)) {
    for (const [countryId, entry] of Object.entries(value.countries)) {
      const normalized = normalizeCountryProgress(countryId, entry);
      if (normalized) {
        countries[countryId] = normalized;
      }
    }
  }

  const totalXp = toSafeCount(value.totalXp);
  const progress: UserProgress = {
    totalXp,
    level: computeLevel(totalXp),
    countries,
    completedSessions: toSafeCount(value.completedSessions),
    // Campos da Versão 3: progresso V1/V2 sem eles segue válido com defaults.
    achievementsUnlocked: normalizeAchievementsUnlocked(value.achievementsUnlocked),
    dailyStreak: normalizeDailyStreak(value.dailyStreak),
    survival: normalizeSurvivalStats(value.survival),
  };
  if (typeof value.lastPlayedAt === "string") {
    progress.lastPlayedAt = value.lastPlayedAt;
  }
  return progress;
}

function normalizeAchievementsUnlocked(value: unknown): Record<string, string> {
  const unlocked: Record<string, string> = {};
  if (isRecord(value)) {
    for (const [id, unlockedAt] of Object.entries(value)) {
      if (id.length > 0 && typeof unlockedAt === "string") {
        unlocked[id] = unlockedAt;
      }
    }
  }
  return unlocked;
}

function normalizeDailyStreak(value: unknown): DailyStreak {
  if (!isRecord(value)) {
    return createInitialDailyStreak();
  }
  const currentStreak = toSafeCount(value.currentStreak);
  const streak: DailyStreak = {
    currentStreak,
    bestStreak: Math.max(currentStreak, toSafeCount(value.bestStreak)),
    restDaysAvailable:
      typeof value.restDaysAvailable === "number"
        ? Math.min(MAX_REST_DAYS, toSafeCount(value.restDaysAvailable))
        : MAX_REST_DAYS,
  };
  if (isDateKey(value.lastActiveDate)) {
    streak.lastActiveDate = value.lastActiveDate;
  }
  return streak;
}

function normalizeSurvivalStats(value: unknown): SurvivalStats {
  if (!isRecord(value)) {
    return createInitialSurvivalStats();
  }
  return {
    bestScore: toSafeCount(value.bestScore),
    bestStreak: toSafeCount(value.bestStreak),
    sessionsCompleted: toSafeCount(value.sessionsCompleted),
  };
}

function normalizeCountryProgress(countryId: string, value: unknown): CountryProgress | null {
  if (!isRecord(value) || typeof countryId !== "string" || countryId.length === 0) {
    return null;
  }
  const masteryPoints = Math.min(MAX_MASTERY_POINTS, toSafeCount(value.masteryPoints));
  const normalized: CountryProgress = {
    countryId,
    seenCount: toSafeCount(value.seenCount),
    correctCount: toSafeCount(value.correctCount),
    wrongCount: toSafeCount(value.wrongCount),
    currentCorrectStreak: toSafeCount(value.currentCorrectStreak),
    bestCorrectStreak: toSafeCount(value.bestCorrectStreak),
    masteryPoints,
    // Recalculado a partir dos pontos: o nível público nunca vem do storage.
    masteryLevel: masteryLevelForPoints(masteryPoints),
    needsReview: value.needsReview === true,
  };
  if (typeof value.lastSeenAt === "string") {
    normalized.lastSeenAt = value.lastSeenAt;
  }
  if (typeof value.lastCorrectAt === "string") {
    normalized.lastCorrectAt = value.lastCorrectAt;
  }
  if (typeof value.lastWrongAt === "string") {
    normalized.lastWrongAt = value.lastWrongAt;
  }
  // Campo opcional adicionado na Versão 2: dados antigos sem ele seguem válidos.
  if (isRecord(value.confusions)) {
    const confusions: Record<string, number> = {};
    for (const [id, count] of Object.entries(value.confusions)) {
      const safe = toSafeCount(count);
      if (id.length > 0 && safe > 0) {
        confusions[id] = safe;
      }
    }
    if (Object.keys(confusions).length > 0) {
      normalized.confusions = confusions;
    }
  }
  return normalized;
}

function toSafeCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
}

export function unwrapEnvelope(value: unknown, expectedVersion: number): unknown {
  if (!isRecord(value) || value.schemaVersion !== expectedVersion) {
    return null;
  }
  return value.data ?? null;
}

export function wrapEnvelope<T>(data: T, version: number): VersionedEnvelope<T> {
  return { schemaVersion: version, data };
}
