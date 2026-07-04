import { beforeEach, describe, expect, it } from "vitest";
import { getCountryById } from "@/entities/country/country.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
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
    useSessionStore.getState().startSession({ mode: "continue", questionType: "typing", size: 5 });
  });

  it("creates questions without multiple-choice options", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions).toHaveLength(5);
    for (const question of session?.questions ?? []) {
      expect(question.optionCountryIds).toBeUndefined();
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
    expect(session?.answers[0]?.acceptedAnswerUsed).toBe(alias);
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
    useSessionStore.getState().startSession({ mode: "similar", questionType: "choice", size: 10 });
  });

  it("only asks about countries from similar-flag groups", () => {
    const session = useSessionStore.getState().session;
    expect(session?.questions.length).toBeGreaterThan(0);
    for (const question of session?.questions ?? []) {
      expect(question.optionCountryIds).toHaveLength(4);
      expect(question.optionCountryIds).toContain(question.countryId);
    }
  });
});

describe("sessionStore choice mode confusion tracking", () => {
  beforeEach(() => {
    useSessionStore.getState().clearSession();
    useProgressStore.getState().resetProgress();
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
