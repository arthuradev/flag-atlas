import { create } from "zustand";
import { getCountryById, listCountriesByContinent } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import {
  createInitialCountryProgress,
  type MasteryLevel,
} from "@/entities/progress/progress.types";
import type {
  MasteryPromotion,
  SessionAnswer,
  SessionConfig,
  SessionQuestion,
  SessionSummary,
  TrainingSession,
} from "@/entities/session/session.types";
import { computeAchievementCoins } from "@/features/cosmetics/logic/coinRewards";
import { useMissionsStore } from "@/features/missions/store/missionsStore";
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { computeAnswerXp, computeLevel } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { matchTypedAnswer, normalizeAnswer } from "@/features/training/logic/answerNormalization";
import { generateOptions, generateSimilarOptions } from "@/features/training/logic/generateOptions";
import { selectReviewCountries } from "@/features/training/logic/selectReviewCountries";
import { selectSessionCountries } from "@/features/training/logic/selectSessionCountries";
import { isSurvivalOver, SURVIVAL_MAX_QUESTIONS } from "@/features/training/logic/survival";
import { COUNTRIES } from "@/shared/data/countries";
import {
  getSimilarGroupById,
  getSimilarPeerIds,
  listSimilarCountryIds,
} from "@/shared/data/similarFlags";
import { createRng, type Rng } from "@/shared/utils/rng";

export type AnswerFeedback = {
  isCorrect: boolean;
  correctCountryId: string;
  selectedCountryId?: string;
  typedAnswer?: string;
  xpGained: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  promoted: boolean;
};

type AnswerInput = {
  isCorrect: boolean;
  selectedCountryId?: string;
  typedAnswer?: string;
  normalizedTypedAnswer?: string;
  acceptedAnswerUsed?: string;
  confusedWithCountryId?: string;
};

type SessionState = {
  session: TrainingSession | null;
  feedback: AnswerFeedback | null;
  sessionXp: number;
  currentStreak: number;
  bestStreak: number;
  summary: SessionSummary | null;
  /** Conquistas desbloqueadas por respostas desta sessão (vai para o resumo). */
  unlockedDuringSession: string[];
  /** Moedas ganhas por respostas desta sessão (conquistas no meio da sessão). */
  coinsDuringSession: number;
  startSession: (config: SessionConfig) => void;
  answerCurrentQuestion: (selectedCountryId: string) => void;
  answerCurrentQuestionTyped: (typedAnswer: string) => void;
  advance: () => void;
  clearSession: () => void;
};

function poolForConfig(config: SessionConfig): readonly Country[] {
  if (config.mode === "continent" && config.continentId) {
    return listCountriesByContinent(config.continentId);
  }
  if (config.mode === "similar") {
    const ids = config.similarGroupId
      ? (getSimilarGroupById(config.similarGroupId)?.countryIds ?? [])
      : listSimilarCountryIds();
    return ids.map(getCountryById).filter((country): country is Country => country !== undefined);
  }
  return COUNTRIES;
}

function selectCountryIds(config: SessionConfig, pool: readonly Country[], rng: Rng): string[] {
  const progress = useProgressStore.getState().progress;
  if (config.mode === "review") {
    return selectReviewCountries({ pool, progress, size: config.size, rng });
  }
  if (config.mode === "survival") {
    // A fila cobre o pool inteiro (até o teto): quem decide o fim são as
    // vidas, e perguntas não repetem enquanto houver países disponíveis.
    const size = Math.min(SURVIVAL_MAX_QUESTIONS, pool.length);
    return selectSessionCountries({ pool, progress, size, rng });
  }
  return selectSessionCountries({ pool, progress, size: config.size, rng });
}

function buildQuestion(config: SessionConfig, countryId: string, rng: Rng): SessionQuestion | null {
  if (config.questionType === "typing") {
    return { countryId };
  }
  const correct = getCountryById(countryId);
  if (!correct) {
    return null;
  }
  const optionCountryIds =
    config.mode === "similar"
      ? generateSimilarOptions({
          correct,
          pool: COUNTRIES,
          peerIds: getSimilarPeerIds(countryId),
          rng,
        })
      : generateOptions({ correct, pool: COUNTRIES, rng });
  return { countryId, optionCountryIds };
}

export const useSessionStore = create<SessionState>((set, get) => {
  const submitAnswer = (input: AnswerInput) => {
    const { session, feedback, currentStreak, bestStreak, sessionXp } = get();
    if (!session || feedback) {
      return;
    }
    const question = session.questions[session.currentIndex];
    if (!question) {
      return;
    }

    const answeredAt = new Date().toISOString();
    const progressStore = useProgressStore.getState();
    const previous =
      progressStore.progress.countries[question.countryId] ??
      createInitialCountryProgress(question.countryId);
    const next = applyAnswerToCountryProgress(previous, {
      isCorrect: input.isCorrect,
      answeredAt,
      ...(input.confusedWithCountryId !== undefined && {
        confusedWithCountryId: input.confusedWithCountryId,
      }),
    });
    const promoted = next.masteryLevel !== previous.masteryLevel && input.isCorrect;
    const streakAfter = input.isCorrect ? currentStreak + 1 : 0;
    const xpGained = computeAnswerXp({ isCorrect: input.isCorrect, promoted, streakAfter });

    const unlockedByAnswer = progressStore.registerAnswer(next, xpGained, answeredAt);
    useMissionsStore.getState().recordAnswer(
      {
        isCorrect: input.isCorrect,
        mode: session.config.mode,
        promoted,
        sessionStreak: streakAfter,
      },
      answeredAt,
    );

    const answer: SessionAnswer = {
      countryId: question.countryId,
      isCorrect: input.isCorrect,
      answeredAt,
      xpGained,
      masteryBefore: previous.masteryLevel,
      masteryAfter: next.masteryLevel,
      ...(input.selectedCountryId !== undefined && {
        selectedCountryId: input.selectedCountryId,
      }),
      ...(input.typedAnswer !== undefined && { typedAnswer: input.typedAnswer }),
      ...(input.normalizedTypedAnswer !== undefined && {
        normalizedTypedAnswer: input.normalizedTypedAnswer,
      }),
      ...(input.acceptedAnswerUsed !== undefined && {
        acceptedAnswerUsed: input.acceptedAnswerUsed,
      }),
    };

    set({
      session: { ...session, answers: [...session.answers, answer] },
      feedback: {
        isCorrect: input.isCorrect,
        correctCountryId: question.countryId,
        xpGained,
        masteryBefore: previous.masteryLevel,
        masteryAfter: next.masteryLevel,
        promoted,
        ...(input.selectedCountryId !== undefined && {
          selectedCountryId: input.selectedCountryId,
        }),
        ...(input.typedAnswer !== undefined && { typedAnswer: input.typedAnswer }),
      },
      sessionXp: sessionXp + xpGained,
      currentStreak: streakAfter,
      bestStreak: Math.max(bestStreak, streakAfter),
      unlockedDuringSession: [...get().unlockedDuringSession, ...unlockedByAnswer],
      coinsDuringSession:
        get().coinsDuringSession + computeAchievementCoins(unlockedByAnswer.length),
    });
  };

  return {
    session: null,
    feedback: null,
    sessionXp: 0,
    currentStreak: 0,
    bestStreak: 0,
    summary: null,
    unlockedDuringSession: [],
    coinsDuringSession: 0,

    startSession: (config) => {
      const rng = createRng();
      const pool = poolForConfig(config);
      const countryIds = selectCountryIds(config, pool, rng);
      const questions = countryIds.flatMap((countryId) => {
        const question = buildQuestion(config, countryId, rng);
        return question ? [question] : [];
      });

      set({
        session: {
          id: `${Date.now()}-${Math.floor(rng() * 1e6)}`,
          config,
          questions,
          currentIndex: 0,
          answers: [],
          startedAt: new Date().toISOString(),
        },
        feedback: null,
        sessionXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        summary: null,
        unlockedDuringSession: [],
        coinsDuringSession: 0,
      });
    },

    answerCurrentQuestion: (selectedCountryId) => {
      const { session } = get();
      const question = session?.questions[session?.currentIndex ?? 0];
      if (!question) {
        return;
      }
      const isCorrect = selectedCountryId === question.countryId;
      submitAnswer({
        isCorrect,
        selectedCountryId,
        ...(!isCorrect && { confusedWithCountryId: selectedCountryId }),
      });
    },

    answerCurrentQuestionTyped: (typedAnswer) => {
      const { session } = get();
      const question = session?.questions[session?.currentIndex ?? 0];
      if (!question) {
        return;
      }
      const normalized = normalizeAnswer(typedAnswer);
      if (normalized.length === 0) {
        // Resposta vazia não é registrada.
        return;
      }
      const country = getCountryById(question.countryId);
      if (!country) {
        return;
      }
      const matched = matchTypedAnswer(country, typedAnswer);
      submitAnswer({
        isCorrect: matched !== null,
        typedAnswer: typedAnswer.trim(),
        normalizedTypedAnswer: normalized,
        ...(matched !== null && { acceptedAnswerUsed: matched }),
      });
    },

    advance: () => {
      const { session, sessionXp, bestStreak, unlockedDuringSession, coinsDuringSession } = get();
      if (!session) {
        return;
      }

      const isLastQuestion = session.currentIndex >= session.questions.length - 1;
      const outOfLives = session.config.mode === "survival" && isSurvivalOver(session);
      if (!isLastQuestion && !outOfLives) {
        set({
          session: { ...session, currentIndex: session.currentIndex + 1 },
          feedback: null,
        });
        return;
      }

      const correctCount = session.answers.filter((answer) => answer.isCorrect).length;
      const wrongCount = session.answers.length - correctCount;
      const accuracy =
        session.answers.length === 0
          ? 0
          : Math.round((correctCount / session.answers.length) * 100);
      const completedAt = new Date().toISOString();

      const completion = useProgressStore.getState().registerCompletedSession({
        mode: session.config.mode,
        questionType: session.config.questionType,
        questionCount: session.answers.length,
        correctCount,
        accuracy,
        bestStreak,
      });
      useMissionsStore.getState().recordSessionCompleted(
        {
          mode: session.config.mode,
          questionType: session.config.questionType,
          accuracy,
          questionCount: session.answers.length,
        },
        completedAt,
      );
      // XP de missão entra depois: o nível do resumo vem do progresso final.
      const progress = useProgressStore.getState().progress;

      const promotions: MasteryPromotion[] = session.answers
        .filter((answer) => answer.isCorrect && answer.masteryAfter !== answer.masteryBefore)
        .map((answer) => ({
          countryId: answer.countryId,
          from: answer.masteryBefore,
          to: answer.masteryAfter,
        }));
      const toReviewCountryIds = [
        ...new Set(
          session.answers
            .filter((answer) => progress.countries[answer.countryId]?.needsReview)
            .map((answer) => answer.countryId),
        ),
      ];
      const xpBefore = progress.totalXp - sessionXp;

      set({
        session: null,
        feedback: null,
        unlockedDuringSession: [],
        coinsDuringSession: 0,
        summary: {
          config: session.config,
          correctCount,
          wrongCount,
          accuracy,
          bestStreak,
          xpEarned: sessionXp,
          promotions,
          toReviewCountryIds,
          levelBefore: computeLevel(xpBefore),
          levelAfter: progress.level,
          unlockedAchievementIds: [
            ...new Set([...unlockedDuringSession, ...completion.unlockedAchievementIds]),
          ],
          coinsEarned: coinsDuringSession + completion.coinsEarned,
          dailyStreak: {
            current: completion.dailyStreak.streak.currentStreak,
            countedToday: completion.dailyStreak.countedToday,
            usedRestDay: completion.dailyStreak.usedRestDay,
            restDaysAvailable: completion.dailyStreak.streak.restDaysAvailable,
          },
          ...(completion.survival !== undefined && { survival: completion.survival }),
        },
      });
    },

    clearSession: () => {
      set({
        session: null,
        feedback: null,
        sessionXp: 0,
        currentStreak: 0,
        bestStreak: 0,
        summary: null,
        unlockedDuringSession: [],
        coinsDuringSession: 0,
      });
    },
  };
});
