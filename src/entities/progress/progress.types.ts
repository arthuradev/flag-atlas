export const MASTERY_LEVELS = ["new", "recognized", "learned", "dominated", "master"] as const;

export type MasteryLevel = (typeof MASTERY_LEVELS)[number];

export type CountryProgress = {
  countryId: string;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  /** Pontos internos de 0 a 10 que definem o nível de domínio. */
  masteryPoints: number;
  masteryLevel: MasteryLevel;
  needsReview: boolean;
  /** Quantas vezes este país foi confundido com cada outro país (múltipla escolha). */
  confusions?: Record<string, number>;
  lastSeenAt?: string;
  lastCorrectAt?: string;
  lastWrongAt?: string;
};

/** Sequência de dias ativos (não confundir com a sequência de acertos na sessão). */
export type DailyStreak = {
  currentStreak: number;
  bestStreak: number;
  /** Último dia ativo, como YYYY-MM-DD local. */
  lastActiveDate?: string;
  /** Descansos disponíveis para proteger a sequência (0..1). */
  restDaysAvailable: number;
};

export type SurvivalStats = {
  bestScore: number;
  bestStreak: number;
  sessionsCompleted: number;
};

export type UserProgress = {
  totalXp: number;
  level: number;
  countries: Record<string, CountryProgress>;
  completedSessions: number;
  /** Conquista desbloqueada → data ISO do desbloqueio. */
  achievementsUnlocked: Record<string, string>;
  dailyStreak: DailyStreak;
  survival: SurvivalStats;
  lastPlayedAt?: string;
};

export function createInitialDailyStreak(): DailyStreak {
  return {
    currentStreak: 0,
    bestStreak: 0,
    restDaysAvailable: 1,
  };
}

export function createInitialSurvivalStats(): SurvivalStats {
  return {
    bestScore: 0,
    bestStreak: 0,
    sessionsCompleted: 0,
  };
}

export function createInitialUserProgress(): UserProgress {
  return {
    totalXp: 0,
    level: 1,
    countries: {},
    completedSessions: 0,
    achievementsUnlocked: {},
    dailyStreak: createInitialDailyStreak(),
    survival: createInitialSurvivalStats(),
  };
}

export function createInitialCountryProgress(countryId: string): CountryProgress {
  return {
    countryId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    currentCorrectStreak: 0,
    bestCorrectStreak: 0,
    masteryPoints: 0,
    masteryLevel: "new",
    needsReview: false,
  };
}
