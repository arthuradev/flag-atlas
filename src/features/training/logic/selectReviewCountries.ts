import type { Country } from "@/entities/country/country.types";
import { isCountryDueForReview } from "@/entities/progress/progress.selectors";
import type { UserProgress } from "@/entities/progress/progress.types";
import { type Rng, shuffle } from "@/shared/utils/rng";

type SelectReviewParams = {
  pool: readonly Country[];
  progress: UserProgress;
  size: number;
  rng: Rng;
};

/**
 * Seleciona países para uma sessão de revisão explícita:
 * 1. prioriza países marcados com needsReview;
 * 2. depois países com revisão espaçada vencida;
 * 3. completa com países já vistos e fracos (menos pontos de domínio,
 *    mais erros — o que também cobre os próximos de evoluir);
 * 4. sem histórico, retorna vazio (a UI oferece treino normal).
 *
 * Nunca repete país: com pouco material, a sessão fica mais curta.
 */
export function selectReviewCountries({ pool, progress, size, rng }: SelectReviewParams): string[] {
  if (size <= 0) {
    return [];
  }

  const review: string[] = [];
  const due: string[] = [];
  const seenFallback: Array<{ id: string; points: number; wrong: number }> = [];

  for (const country of pool) {
    const countryProgress = progress.countries[country.id];
    if (!countryProgress || countryProgress.seenCount === 0) {
      continue;
    }
    if (countryProgress.needsReview) {
      review.push(country.id);
    } else if (isCountryDueForReview(countryProgress)) {
      due.push(country.id);
    } else {
      seenFallback.push({
        id: country.id,
        points: countryProgress.masteryPoints,
        wrong: countryProgress.wrongCount,
      });
    }
  }

  const selected = shuffle(review, rng).slice(0, size);

  if (selected.length < size) {
    for (const id of shuffle(due, rng)) {
      if (selected.length >= size) {
        break;
      }
      selected.push(id);
    }
  }

  if (selected.length < size) {
    // Ordenação estável sobre lista embaralhada: empates ficam aleatórios,
    // mas determinísticos para o mesmo seed.
    const fallback = shuffle(seenFallback, rng).sort(
      (a, b) => a.points - b.points || b.wrong - a.wrong,
    );
    for (const candidate of fallback) {
      if (selected.length >= size) {
        break;
      }
      selected.push(candidate.id);
    }
  }

  return shuffle(selected, rng);
}
