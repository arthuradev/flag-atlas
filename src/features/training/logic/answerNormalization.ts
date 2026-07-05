import type { Country } from "@/entities/country/country.types";

/**
 * Normaliza uma resposta digitada para comparação robusta:
 * minúsculas, sem acentos (NFD + remoção de marcas), pontuação e
 * hífens/apóstrofos viram espaço, espaços colapsados.
 *
 * "São Tomé e Príncipe" -> "sao tome e principe"
 * "Côte d'Ivoire"       -> "cote d ivoire"
 */
export function normalizeAnswer(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Todas as respostas aceitas para um país: nomes públicos em pt-BR e
 * en-US mais os aliases de cada idioma (ex.: EUA, USA, Santa Sé, UK).
 * O código ISO2 não é aceito de propósito: adivinhar "br" não é
 * aprender o nome do país.
 */
export function getAcceptedAnswers(country: Country): string[] {
  const answers = [
    country.names["pt-BR"],
    country.names["en-US"],
    ...(country.aliases?.["pt-BR"] ?? []),
    ...(country.aliases?.["en-US"] ?? []),
  ];
  return [...new Set(answers)];
}

/**
 * Retorna a resposta aceita que casou com o texto digitado, ou null.
 * Respostas vazias nunca casam.
 */
export function matchTypedAnswer(country: Country, typedAnswer: string): string | null {
  const normalized = normalizeAnswer(typedAnswer);
  if (normalized.length === 0) {
    return null;
  }
  for (const accepted of getAcceptedAnswers(country)) {
    if (normalizeAnswer(accepted) === normalized) {
      return accepted;
    }
  }
  return null;
}

export function isTypedAnswerCorrect(country: Country, typedAnswer: string): boolean {
  return matchTypedAnswer(country, typedAnswer) !== null;
}
