import { afterEach, describe, expect, it, vi } from "vitest";
import type { SessionSummary } from "@/entities/session/session.types";
import { i18n } from "@/shared/i18n";
import { buildShareText, SHARE_URL, shareOrCopyText } from "./shareText";

function summaryOf(overrides: Partial<SessionSummary>): SessionSummary {
  return {
    config: { mode: "continue", questionType: "choice", size: 10 },
    correctCount: 8,
    wrongCount: 2,
    accuracy: 80,
    bestStreak: 5,
    xpEarned: 120,
    answerXpEarned: 90,
    baseAnswerXpEarned: 80,
    answerBonusXpEarned: 10,
    missionXpEarned: 30,
    promotions: [],
    toReviewCountryIds: [],
    levelBefore: 1,
    levelAfter: 2,
    unlockedAchievementIds: [],
    coinsEarned: 10,
    dailyStreak: { current: 1, countedToday: true, usedRestDay: false, restDaysAvailable: 1 },
    ...overrides,
  };
}

describe("buildShareText", () => {
  it("formats a normal session in pt-BR", () => {
    const text = buildShareText({
      summary: summaryOf({}),
      seenCount: 37,
      totalCountries: 195,
      t: i18n.getFixedT("pt-BR"),
    });
    expect(text).toBe(
      [
        "Flag Atlas",
        "Sessão concluída!",
        "",
        "Acertos: 8/10",
        "Melhor sequência: 5",
        "XP: +120",
        "Países vistos: 37/195",
        "",
        `Jogue também: ${SHARE_URL}`,
      ].join("\n"),
    );
  });

  it("formats a survival session in pt-BR", () => {
    const text = buildShareText({
      summary: summaryOf({
        config: { mode: "survival", questionType: "choice", size: 10 },
        correctCount: 39,
        wrongCount: 3,
        bestStreak: 12,
        survival: { score: 42, previousBest: 20, isNewRecord: true },
      }),
      seenCount: 37,
      totalCountries: 195,
      t: i18n.getFixedT("pt-BR"),
    });
    expect(text).toBe(
      [
        "Flag Atlas",
        "Modo Sobrevivência",
        "",
        "Pontuação: 42",
        "Acertos: 39",
        "Erros: 3",
        "Melhor sequência: 12",
        "",
        `Jogue também: ${SHARE_URL}`,
      ].join("\n"),
    );
  });

  it("formats in en-US as well", () => {
    const text = buildShareText({
      summary: summaryOf({}),
      seenCount: 37,
      totalCountries: 195,
      t: i18n.getFixedT("en-US"),
    });
    expect(text).toContain("Session complete!");
    expect(text).toContain("Correct: 8/10");
    expect(text).toContain(`Play too: ${SHARE_URL}`);
  });
});

describe("shareOrCopyText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prefers the Web Share API when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });
    await expect(shareOrCopyText("texto")).resolves.toBe("shared");
    expect(share).toHaveBeenCalledWith({ text: "texto" });
  });

  it("treats a dismissed share dialog as neither success nor failure", async () => {
    const abort = new Error("dismissed");
    abort.name = "AbortError";
    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(abort) });
    await expect(shareOrCopyText("texto")).resolves.toBe("dismissed");
  });

  it("falls back to the clipboard when share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(shareOrCopyText("texto")).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("texto");
  });

  it("falls back to the clipboard when share fails for real", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      share: vi.fn().mockRejectedValue(new Error("denied")),
      clipboard: { writeText },
    });
    await expect(shareOrCopyText("texto")).resolves.toBe("copied");
  });

  it("reports failure when nothing works", async () => {
    vi.stubGlobal("navigator", {});
    await expect(shareOrCopyText("texto")).resolves.toBe("failed");
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("nope")) },
    });
    await expect(shareOrCopyText("texto")).resolves.toBe("failed");
  });
});
