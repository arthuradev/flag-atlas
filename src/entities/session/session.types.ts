import type { ContinentId } from "@/entities/continent/continent.types";
import type { MasteryLevel } from "@/entities/progress/progress.types";
import type { SessionSize } from "@/entities/settings/settings.types";

export type QuestionType = "choice" | "typing";

export type SessionMode = "continue" | "continent" | "review" | "similar" | "survival";

export type SessionConfig = {
  mode: SessionMode;
  questionType: QuestionType;
  continentId?: ContinentId;
  /** Restringe o modo "similar" a um grupo específico (opcional). */
  similarGroupId?: string;
  size: SessionSize;
};

export type SessionQuestion = {
  countryId: string;
  /** 4 alternativas embaralhadas, incluindo a correta. Ausente no modo digitação. */
  optionCountryIds?: readonly string[];
};

export type SessionAnswer = {
  countryId: string;
  isCorrect: boolean;
  answeredAt: string;
  xpGained: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  masteryPointsBefore?: number;
  masteryPointsAfter?: number;
  nextReviewAt?: string;
  /** Alternativa escolhida (apenas múltipla escolha). */
  selectedCountryId?: string;
  /** Resposta explicitamente pulada pelo jogador. */
  isSkipped?: boolean;
  /** Texto digitado pelo usuário (apenas modo digitação). */
  typedAnswer?: string;
  normalizedTypedAnswer?: string;
  /** Resposta aceita que casou com o texto digitado (nome ou alias). */
  acceptedAnswerUsed?: string;
};

export type TrainingSession = {
  id: string;
  config: SessionConfig;
  questions: readonly SessionQuestion[];
  currentIndex: number;
  answers: SessionAnswer[];
  startedAt: string;
};

export type MasteryPromotion = {
  countryId: string;
  from: MasteryLevel;
  to: MasteryLevel;
  pointsBefore?: number;
  pointsAfter?: number;
};

export type SummaryDailyStreak = {
  current: number;
  /** true quando esta sessão fez o dia de hoje contar. */
  countedToday: boolean;
  usedRestDay: boolean;
  restDaysAvailable: number;
};

export type SummarySurvival = {
  score: number;
  previousBest: number;
  isNewRecord: boolean;
};

export type SessionSummary = {
  config: SessionConfig;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  bestStreak: number;
  /** XP total realmente adicionado ao progresso durante a sessÃ£o. */
  xpEarned: number;
  /** XP vindo das respostas, incluindo bÃ´nus de sequÃªncia e promoÃ§Ã£o. */
  answerXpEarned: number;
  /** Parte do XP de respostas que veio do valor base por acerto. */
  baseAnswerXpEarned: number;
  /** Parte do XP de respostas que veio de sequÃªncia ou promoÃ§Ã£o de domÃ­nio. */
  answerBonusXpEarned: number;
  /** XP concedido por missÃµes concluÃ­das durante ou ao fechar a sessÃ£o. */
  missionXpEarned: number;
  promotions: MasteryPromotion[];
  toReviewCountryIds: string[];
  levelBefore: number;
  levelAfter: number;
  /** Conquistas desbloqueadas ao longo desta sessão (Versão 3). */
  unlockedAchievementIds: string[];
  /** Moedas Flaggo ganhas nesta sessão: sessão + conquistas (Versão 4). */
  coinsEarned: number;
  dailyStreak: SummaryDailyStreak;
  /** Presente apenas em sessões de sobrevivência. */
  survival?: SummarySurvival;
};
