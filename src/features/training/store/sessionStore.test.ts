import { beforeEach, describe, expect, it } from "vitest";
import { getCountryById } from "@/entities/country/country.selectors";
import { useMissionsStore } from "@/features/missions/store/missionsStore";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { normalizeAnswer } from "@/features/training/logic/answerNormalization";
import { getSurvivalLivesRemaining } from "@/features/training/logic/survival";
import { useSessionStore } from "./sessionStore";

function currentCountry() {
  const session = useSessionStore.getState().session;
  if (!session) {
    throw new Error("no active session");
  }
  const question = session.questions[session.currentIndex];
  if (!question) {
    throw new Error("no current question");
  }
  const country = getCountryById(question.countryId);
  if (!country) {
    throw new Error("unknown country in question");
  }
  return country;
}

describe("sessionStore typing mode", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
    useSessionStore.getState().startSession({ mode: "continue", questionType: "typing", size: 5 });
  });

  it("creates questions without multiple-choice options", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions).toHaveLength(5);
    for (const question of session?.questions ?? []) {
      expect(question.optionCountryIds).toBeUndefined();
      expect(question.exerciseType).toBe("typing");
    }
  });

  it("accepts the main pt-BR name as a correct answer", () => {
    const country = currentCountry();
    useSessionStore.getState().answerCurrentQuestionTyped(country.names["pt-BR"]);
    const { feedback } = useSessionStore.getState();
    expect(feedback?.isCorrect).toBe(true);
    expect(feedback?.typedAnswer).toBe(country.names["pt-BR"]);
  });

  it("accepts an alias with messy formatting as a correct answer", () => {
    const country = currentCountry();
    const alias = country.aliases?.["pt-BR"]?.[0] ?? country.names["en-US"];
    useSessionStore.getState().answerCurrentQuestionTyped(`  ${alias.toUpperCase()}  `);
    const { feedback, session } = useSessionStore.getState();
    expect(feedback?.isCorrect).toBe(true);
    // Nomes distintos podem normalizar igual (ex.: Zâmbia/Zambia): o match
    // devolve o primeiro aceito, então a comparação é pela forma normalizada.
    expect(normalizeAnswer(session?.answers[0]?.acceptedAnswerUsed ?? "")).toBe(
      normalizeAnswer(alias),
    );
  });

  it("marks the country for review on a wrong typed answer", () => {
    const country = currentCountry();
    useSessionStore.getState().answerCurrentQuestionTyped("resposta claramente errada");
    const { feedback } = useSessionStore.getState();
    expect(feedback?.isCorrect).toBe(false);
    const progress = useProgressStore.getState().progress;
    expect(progress.countries[country.id]?.needsReview).toBe(true);
    // Digitação errada não registra confusão com outro país.
    expect(progress.countries[country.id]?.confusions).toBeUndefined();
  });

  it("does not register empty or whitespace-only answers", () => {
    useSessionStore.getState().answerCurrentQuestionTyped("   ");
    const { feedback, session } = useSessionStore.getState();
    expect(feedback).toBeNull();
    expect(session?.answers).toHaveLength(0);
  });
});

describe("sessionStore similar mode", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
    useSessionStore.getState().startSession({ mode: "similar", questionType: "choice", size: 10 });
  });

  it("only asks about countries from similar-flag groups", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions.length).toBeGreaterThan(0);
    for (const question of session?.questions ?? []) {
      expect(question.optionCountryIds).toHaveLength(4);
      expect(question.optionCountryIds).toContain(question.countryId);
      expect(question.exerciseType).toBe("similar_flags");
    }
  });
});

describe("sessionStore survival mode", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
    useSessionStore.getState().startSession({
      mode: "survival",
      questionType: "choice",
      size: 10,
    });
  });

  function answerWrong() {
    const state = useSessionStore.getState();
    const question = state.session?.questions[state.session.currentIndex];
    const wrongOption = question?.optionCountryIds?.find((id) => id !== question.countryId);
    if (!wrongOption) {
      throw new Error("expected a wrong option");
    }
    state.answerCurrentQuestion(wrongOption);
    useSessionStore.getState().advance();
  }

  function answerRight() {
    const state = useSessionStore.getState();
    const question = state.session?.questions[state.session.currentIndex];
    if (!question) {
      throw new Error("expected a question");
    }
    state.answerCurrentQuestion(question.countryId);
    useSessionStore.getState().advance();
  }

  it("queues up to the cap without repeating countries", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions.length).toBe(100);
    const ids = session?.questions.map((question) => question.countryId) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps flag_to_country as the exercise type (survival is a modifier)", () => {
    const session = useSessionStore.getState().session;
    for (const question of session?.questions ?? []) {
      expect(question.exerciseType).toBe("flag_to_country");
    }
  });

  it("starts with all lives and loses one per wrong answer only", () => {
    const session = useSessionStore.getState().session;
    if (!session) {
      throw new Error("expected a session");
    }
    expect(getSurvivalLivesRemaining(session)).toBe(3);

    answerRight();
    const afterRight = useSessionStore.getState().session;
    expect(afterRight && getSurvivalLivesRemaining(afterRight)).toBe(3);

    answerWrong();
    const afterWrong = useSessionStore.getState().session;
    expect(afterWrong && getSurvivalLivesRemaining(afterWrong)).toBe(2);
  });

  it("ends the session when lives run out and reports the score", () => {
    answerRight();
    answerRight();
    answerWrong();
    answerWrong();
    expect(useSessionStore.getState().session).not.toBeNull();
    answerWrong();

    const { session, summary } = useSessionStore.getState();
    expect(session).toBeNull();
    expect(summary?.survival).toEqual({ score: 2, previousBest: 0, isNewRecord: true });
    expect(summary?.correctCount).toBe(2);
    expect(summary?.wrongCount).toBe(3);
    expect(summary?.skippedCount).toBe(0);

    const progress = useProgressStore.getState().progress;
    expect(progress.survival.bestScore).toBe(2);
    expect(progress.survival.sessionsCompleted).toBe(1);
  });

  it("keeps the previous record when the new score is lower", () => {
    // Primeira rodada: 1 acerto.
    answerRight();
    answerWrong();
    answerWrong();
    answerWrong();
    expect(useSessionStore.getState().summary?.survival?.isNewRecord).toBe(true);

    useSessionStore.getState().startSession({
      mode: "survival",
      questionType: "choice",
      size: 10,
    });
    answerWrong();
    answerWrong();
    answerWrong();
    const summary = useSessionStore.getState().summary;
    expect(summary?.survival).toEqual({ score: 0, previousBest: 1, isNewRecord: false });
    expect(useProgressStore.getState().progress.survival.bestScore).toBe(1);
  });
});

describe("sessionStore normal flow with v3 summary", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
    useSessionStore.getState().startSession({ mode: "continue", questionType: "choice", size: 5 });
  });

  it("annotates every question with the derived exercise type", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions.length).toBeGreaterThan(0);
    for (const question of session?.questions ?? []) {
      expect(question.exerciseType).toBe("flag_to_country");
    }
  });

  it("completes a normal session without survival data and with streak info", () => {
    for (let i = 0; i < 5; i++) {
      const state = useSessionStore.getState();
      const question = state.session?.questions[state.session.currentIndex];
      if (!question) {
        throw new Error("expected a question");
      }
      state.answerCurrentQuestion(question.countryId);
      useSessionStore.getState().advance();
    }
    const summary = useSessionStore.getState().summary;
    expect(summary?.survival).toBeUndefined();
    expect(summary?.correctCount).toBe(5);
    expect(summary?.wrongCount).toBe(0);
    expect(summary?.skippedCount).toBe(0);
    expect(summary?.accuracy).toBe(100);
    expect(summary?.dailyStreak.countedToday).toBe(true);
    expect(summary?.dailyStreak.current).toBe(1);
    expect(summary?.unlockedAchievementIds).toContain("firstSteps");
    // 5/5 em sessão de 5 perguntas também rende a conquista de precisão.
    expect(summary?.unlockedAchievementIds).toContain("flawless");
    expect(summary?.xpEarned).toBe(
      (summary?.answerXpEarned ?? 0) + (summary?.missionXpEarned ?? 0),
    );
    expect(summary?.baseAnswerXpEarned).toBe(50);
    expect(summary?.missionXpEarned).toBeGreaterThanOrEqual(10);
    expect(useProgressStore.getState().progress.totalXp).toBe(summary?.xpEarned);
  });

  it("separates skipped answers from real wrong answers in the summary", () => {
    const answerRight = () => {
      const state = useSessionStore.getState();
      const question = state.session?.questions[state.session.currentIndex];
      if (!question) {
        throw new Error("expected a question");
      }
      state.answerCurrentQuestion(question.countryId);
      useSessionStore.getState().advance();
    };
    const answerWrong = () => {
      const state = useSessionStore.getState();
      const question = state.session?.questions[state.session.currentIndex];
      const wrongOption = question?.optionCountryIds?.find((id) => id !== question.countryId);
      if (!wrongOption) {
        throw new Error("expected a wrong option");
      }
      state.answerCurrentQuestion(wrongOption);
      useSessionStore.getState().advance();
    };
    const skip = () => {
      useSessionStore.getState().skipCurrentQuestion();
      useSessionStore.getState().advance();
    };

    answerRight();
    answerWrong();
    skip();
    answerRight();
    skip();

    const summary = useSessionStore.getState().summary;
    expect(summary?.correctCount).toBe(2);
    expect(summary?.wrongCount).toBe(1);
    expect(summary?.skippedCount).toBe(2);
    expect(summary?.accuracy).toBe(40);
  });

  it("skips the current question as a wrong answer without selecting a wrong option", () => {
    const question = useSessionStore.getState().session?.questions[0];
    if (!question) {
      throw new Error("expected a question");
    }

    useSessionStore.getState().skipCurrentQuestion();

    const { feedback, session, currentStreak } = useSessionStore.getState();
    expect(feedback?.isCorrect).toBe(false);
    expect(feedback?.isSkipped).toBe(true);
    expect(feedback?.selectedCountryId).toBeUndefined();
    expect(feedback?.xpGained).toBe(0);
    expect(currentStreak).toBe(0);
    expect(session?.answers[0]?.isSkipped).toBe(true);
    expect(session?.answers[0]?.isCorrect).toBe(false);
    expect(session?.answers[0]?.selectedCountryId).toBeUndefined();

    const progress = useProgressStore.getState().progress.countries[question.countryId];
    expect(progress?.needsReview).toBe(true);
    expect(progress?.wrongCount).toBe(1);
    expect(progress?.currentCorrectStreak).toBe(0);
    expect(progress?.confusions).toBeUndefined();
  });

  it("dismisses an old summary without clearing an active session", () => {
    expect(useSessionStore.getState().session).not.toBeNull();

    useSessionStore.getState().dismissSummary();

    expect(useSessionStore.getState().summary).toBeNull();
    expect(useSessionStore.getState().session).not.toBeNull();
  });

  it("clears a completed summary on demand", () => {
    for (let i = 0; i < 5; i++) {
      const state = useSessionStore.getState();
      const question = state.session?.questions[state.session.currentIndex];
      if (!question) {
        throw new Error("expected a question");
      }
      state.answerCurrentQuestion(question.countryId);
      useSessionStore.getState().advance();
    }

    expect(useSessionStore.getState().summary).not.toBeNull();

    useSessionStore.getState().dismissSummary();

    expect(useSessionStore.getState().summary).toBeNull();
    expect(useSessionStore.getState().session).toBeNull();
  });
});

describe("sessionStore choice mode confusion tracking", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
    useSessionStore.getState().startSession({ mode: "continue", questionType: "choice", size: 5 });
  });

  it("records the confused country on a wrong selection", () => {
    const state = useSessionStore.getState();
    const question = state.session?.questions[0];
    if (!question?.optionCountryIds) {
      throw new Error("expected a choice question");
    }
    const wrongOption = question.optionCountryIds.find((id) => id !== question.countryId);
    if (!wrongOption) {
      throw new Error("expected a wrong option");
    }
    state.answerCurrentQuestion(wrongOption);
    const progress = useProgressStore.getState().progress;
    expect(progress.countries[question.countryId]?.confusions).toEqual({ [wrongOption]: 1 });
  });
});
