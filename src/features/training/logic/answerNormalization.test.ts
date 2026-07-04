import { describe, expect, it } from "vitest";
import { getCountryById } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import {
  getAcceptedAnswers,
  isTypedAnswerCorrect,
  matchTypedAnswer,
  normalizeAnswer,
} from "./answerNormalization";

function country(id: string): Country {
  const found = getCountryById(id);
  if (!found) {
    throw new Error(`missing ${id} in dataset`);
  }
  return found;
}

describe("normalizeAnswer", () => {
  it("removes accents and lowercases", () => {
    expect(normalizeAnswer("São Tomé e Príncipe")).toBe("sao tome e principe");
    expect(normalizeAnswer("TURQUIA")).toBe("turquia");
  });

  it("turns punctuation, hyphens and apostrophes into spaces", () => {
    expect(normalizeAnswer("Côte d'Ivoire")).toBe("cote d ivoire");
    expect(normalizeAnswer("Guiné-Bissau")).toBe("guine bissau");
    expect(normalizeAnswer("U.S.A.")).toBe("u s a");
  });

  it("collapses and trims whitespace", () => {
    expect(normalizeAnswer("  estados   unidos  ")).toBe("estados unidos");
  });

  it("returns empty string for empty or punctuation-only input", () => {
    expect(normalizeAnswer("")).toBe("");
    expect(normalizeAnswer("   ")).toBe("");
    expect(normalizeAnswer("?!...")).toBe("");
  });
});

describe("getAcceptedAnswers", () => {
  it("includes both locale names and all aliases", () => {
    const answers = getAcceptedAnswers(country("us"));
    expect(answers).toContain("Estados Unidos");
    expect(answers).toContain("United States");
    expect(answers).toContain("EUA");
    expect(answers).toContain("USA");
  });

  it("does not include the ISO2 code", () => {
    const normalized = getAcceptedAnswers(country("br")).map(normalizeAnswer);
    expect(normalized).not.toContain("br");
  });
});

describe("isTypedAnswerCorrect", () => {
  it("accepts the pt-BR name regardless of accents and case", () => {
    expect(isTypedAnswerCorrect(country("jp"), "japão")).toBe(true);
    expect(isTypedAnswerCorrect(country("jp"), "JAPAO")).toBe(true);
  });

  it("accepts the en-US name", () => {
    expect(isTypedAnswerCorrect(country("jp"), "Japan")).toBe(true);
    expect(isTypedAnswerCorrect(country("de"), "germany")).toBe(true);
  });

  it("accepts aliases in both locales", () => {
    expect(isTypedAnswerCorrect(country("us"), "EUA")).toBe(true);
    expect(isTypedAnswerCorrect(country("us"), "usa")).toBe(true);
    expect(isTypedAnswerCorrect(country("va"), "Vaticano")).toBe(true);
    expect(isTypedAnswerCorrect(country("va"), "santa sé")).toBe(true);
    expect(isTypedAnswerCorrect(country("gb"), "UK")).toBe(true);
    expect(isTypedAnswerCorrect(country("gb"), "great britain")).toBe(true);
  });

  it("accepts compound names with punctuation variations", () => {
    expect(isTypedAnswerCorrect(country("st"), "sao tome e principe")).toBe(true);
    expect(isTypedAnswerCorrect(country("ci"), "cote d ivoire")).toBe(true);
    expect(isTypedAnswerCorrect(country("ci"), "Côte d'Ivoire")).toBe(true);
  });

  it("accepts answers with extra surrounding spaces", () => {
    expect(isTypedAnswerCorrect(country("br"), "  brasil  ")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(isTypedAnswerCorrect(country("br"), "argentina")).toBe(false);
    expect(isTypedAnswerCorrect(country("td"), "romenia")).toBe(false);
  });

  it("rejects empty answers", () => {
    expect(isTypedAnswerCorrect(country("br"), "")).toBe(false);
    expect(isTypedAnswerCorrect(country("br"), "   ")).toBe(false);
  });
});

describe("matchTypedAnswer", () => {
  it("returns the accepted answer that matched", () => {
    expect(matchTypedAnswer(country("us"), "eua")).toBe("EUA");
    expect(matchTypedAnswer(country("br"), "Brasil")).toBe("Brasil");
    expect(matchTypedAnswer(country("br"), "nope")).toBeNull();
  });
});
