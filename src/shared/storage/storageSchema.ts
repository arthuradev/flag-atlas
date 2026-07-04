import { normalizeCosmeticInventory } from "@/entities/cosmetic/cosmetic.selectors";
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
import {
  CORRECT_DATE_KEY_LIMIT,
  deriveMasteryLevel,
  MASTERY_SYSTEM_VERSION,
  MAX_MASTERY_POINTS,
} from "@/features/progress/logic/mastery";
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
    // Campo da Versão 4: progresso V1/V2/V3 sem ele carrega com defaults seguros.
    cosmetics: normalizeCosmeticInventory(value.cosmetics),
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
  const masteryPoints = normalizeMasteryPoints(value);
  const normalized: CountryProgress = {
    countryId,
    seenCount: toSafeCount(value.seenCount),
    correctCount: toSafeCount(value.correctCount),
    wrongCount: toSafeCount(value.wrongCount),
    currentCorrectStreak: toSafeCount(value.currentCorrectStreak),
    bestCorrectStreak: toSafeCount(value.bestCorrectStreak),
    masteryPoints,
    // Recalculado: o nível público nunca vem diretamente do storage.
    masteryLevel: "new",
    needsReview: value.needsReview === true,
    masterySystemVersion: MASTERY_SYSTEM_VERSION,
    correctDateKeys: normalizeCorrectDateKeys(value.correctDateKeys),
    typedCorrectCount: toSafeCount(value.typedCorrectCount),
    choiceCorrectCount: toSafeCount(value.choiceCorrectCount),
    reviewCorrectCount: toSafeCount(value.reviewCorrectCount),
    similarCorrectCount: toSafeCount(value.similarCorrectCount),
    survivalCorrectCount: toSafeCount(value.survivalCorrectCount),
    successfulReviews: toSafeCount(value.successfulReviews),
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
  if (typeof value.lastPromotionAt === "string") {
    normalized.lastPromotionAt = value.lastPromotionAt;
  }
  if (isDateKey(value.nextReviewAt)) {
    normalized.nextReviewAt = value.nextReviewAt;
  }
  if (isSessionMode(value.lastMasteryMode)) {
    normalized.lastMasteryMode = value.lastMasteryMode;
  }
  if (isQuestionType(value.lastMasteryQuestionType)) {
    normalized.lastMasteryQuestionType = value.lastMasteryQuestionType;
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
  normalized.masteryLevel = deriveMasteryLevel(normalized);
  return normalized;
}

function normalizeMasteryPoints(value: Record<string, unknown>): number {
  const raw = toSafeCount(value.masteryPoints);
  if (value.masterySystemVersion === MASTERY_SYSTEM_VERSION) {
    return Math.min(MAX_MASTERY_POINTS, raw);
  }
  return legacyMasteryPointsToV2(Math.min(10, raw));
}

function legacyMasteryPointsToV2(points: number): number {
  const legacy = Math.min(10, Math.max(0, Math.floor(points)));
  if (legacy === 0) {
    return 0;
  }
  if (legacy <= 2) {
    return legacy === 1 ? 8 : 15;
  }
  if (legacy <= 5) {
    return legacy === 3 ? 25 : legacy === 4 ? 32 : 40;
  }
  if (legacy <= 8) {
    return legacy === 6 ? 55 : legacy === 7 ? 60 : 65;
  }
  return legacy === 9 ? 75 : 80;
}

function normalizeCorrectDateKeys(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const unique = new Set<string>();
  for (const key of value) {
    if (isDateKey(key)) {
      unique.add(key);
    }
  }
  return [...unique].sort().slice(-CORRECT_DATE_KEY_LIMIT);
}

function isSessionMode(value: unknown): value is NonNullable<CountryProgress["lastMasteryMode"]> {
  return (
    value === "continue" ||
    value === "continent" ||
    value === "review" ||
    value === "similar" ||
    value === "survival"
  );
}

function isQuestionType(
  value: unknown,
): value is NonNullable<CountryProgress["lastMasteryQuestionType"]> {
  return value === "choice" || value === "typing";
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
