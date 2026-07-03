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
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { computeAnswerXp, computeLevel } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { generateOptions } from "@/features/training/logic/generateOptions";
import { selectSessionCountries } from "@/features/training/logic/selectSessionCountries";
import { COUNTRIES } from "@/shared/data/countries";
import { createRng } from "@/shared/utils/rng";

export type AnswerFeedback = {
  isCorrect: boolean;
  correctCountryId: string;
  selectedCountryId: string;
  xpGained: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  promoted: boolean;
};

type SessionState = {
  session: TrainingSession | null;
  feedback: AnswerFeedback | null;
  sessionXp: number;
  currentStreak: number;
  bestStreak: number;
  summary: SessionSummary | null;
  startSession: (config: SessionConfig) => void;
  answerCurrentQuestion: (selectedCountryId: string) => void;
  advance: () => void;
  clearSession: () => void;
};

function poolForConfig(config: SessionConfig): readonly Country[] {
  if (config.mode === "continent" && config.continentId) {
    return listCountriesByContinent(config.continentId);
  }
  return COUNTRIES;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  feedback: null,
  sessionXp: 0,
  currentStreak: 0,
  bestStreak: 0,
  summary: null,

  startSession: (config) => {
    const rng = createRng();
    const pool = poolForConfig(config);
    const progress = useProgressStore.getState().progress;
    const countryIds = selectSessionCountries({ pool, progress, size: config.size, rng });
    const questions: SessionQuestion[] = countryIds.flatMap((countryId) => {
      const correct = getCountryById(countryId);
      if (!correct) {
        return [];
      }
      return [{ countryId, optionCountryIds: generateOptions({ correct, pool: COUNTRIES, rng }) }];
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
    });
  },

  answerCurrentQuestion: (selectedCountryId) => {
    const { session, feedback, currentStreak, bestStreak, sessionXp } = get();
    if (!session || feedback) {
      return;
    }
    const question = session.questions[session.currentIndex];
    if (!question) {
      return;
    }

    const answeredAt = new Date().toISOString();
    const isCorrect = selectedCountryId === question.countryId;
    const progressStore = useProgressStore.getState();
    const previous =
      progressStore.progress.countries[question.countryId] ??
      createInitialCountryProgress(question.countryId);
    const next = applyAnswerToCountryProgress(previous, { isCorrect, answeredAt });
    const promoted = next.masteryLevel !== previous.masteryLevel && isCorrect;
    const streakAfter = isCorrect ? currentStreak + 1 : 0;
    const xpGained = computeAnswerXp({ isCorrect, promoted, streakAfter });

    progressStore.registerAnswer(next, xpGained, answeredAt);

    const answer: SessionAnswer = {
      countryId: question.countryId,
      selectedCountryId,
      isCorrect,
      answeredAt,
      xpGained,
      masteryBefore: previous.masteryLevel,
      masteryAfter: next.masteryLevel,
    };

    set({
      session: { ...session, answers: [...session.answers, answer] },
      feedback: {
        isCorrect,
        correctCountryId: question.countryId,
        selectedCountryId,
        xpGained,
        masteryBefore: previous.masteryLevel,
        masteryAfter: next.masteryLevel,
        promoted,
      },
      sessionXp: sessionXp + xpGained,
      currentStreak: streakAfter,
      bestStreak: Math.max(bestStreak, streakAfter),
    });
  },

  advance: () => {
    const { session, sessionXp, bestStreak } = get();
    if (!session) {
      return;
    }

    const isLastQuestion = session.currentIndex >= session.questions.length - 1;
    if (!isLastQuestion) {
      set({
        session: { ...session, currentIndex: session.currentIndex + 1 },
        feedback: null,
      });
      return;
    }

    const progressStore = useProgressStore.getState();
    progressStore.registerCompletedSession();
    const progress = useProgressStore.getState().progress;

    const correctCount = session.answers.filter((answer) => answer.isCorrect).length;
    const wrongCount = session.answers.length - correctCount;
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
      summary: {
        config: session.config,
        correctCount,
        wrongCount,
        accuracy:
          session.answers.length === 0
            ? 0
            : Math.round((correctCount / session.answers.length) * 100),
        bestStreak,
        xpEarned: sessionXp,
        promotions,
        toReviewCountryIds,
        levelBefore: computeLevel(xpBefore),
        levelAfter: progress.level,
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
    });
  },
}));
