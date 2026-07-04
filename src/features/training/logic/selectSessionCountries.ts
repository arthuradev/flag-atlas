import type { Country } from "@/entities/country/country.types";
import { isCountryDueForReview } from "@/entities/progress/progress.selectors";
import { MASTERY_LEVELS, type UserProgress } from "@/entities/progress/progress.types";
import { type Rng, shuffle } from "@/shared/utils/rng";

type SelectParams = {
  pool: readonly Country[];
  progress: UserProgress;
  size: number;
  rng: Rng;
};

/** Distância em pontos até a próxima evolução de domínio (menor = mais perto). */
function pointsToNextLevel(points: number): number {
  const thresholds = [1, 20, 50, 85];
  for (const threshold of thresholds) {
    if (points < threshold) {
      return threshold - points;
    }
  }
  return Number.POSITIVE_INFINITY;
}

/**
 * Seleciona os países de uma sessão de treino conforme .specs/SESSION_ALGORITHM.md:
 * ~40% revisão/fracos, ~30% novos, ~30% em progresso/perto de evoluir.
 * Sem histórico, prioriza descoberta (países novos embaralhados).
 * Não repete país, salvo quando o conjunto disponível é menor que a sessão.
 */
export function selectSessionCountries({ pool, progress, size, rng }: SelectParams): string[] {
  if (pool.length === 0 || size <= 0) {
    return [];
  }

  const review: string[] = [];
  const fresh: string[] = [];
  const inProgress: string[] = [];

  for (const country of pool) {
    const countryProgress = progress.countries[country.id];
    if (!countryProgress || countryProgress.seenCount === 0) {
      fresh.push(country.id);
    } else if (isCountryDueForReview(countryProgress)) {
      review.push(country.id);
    } else if (countryProgress.masteryLevel !== MASTERY_LEVELS[MASTERY_LEVELS.length - 1]) {
      inProgress.push(country.id);
    } else {
      // Países já Mestre voltam com prioridade mínima, no fim da fila.
      inProgress.push(country.id);
    }
  }

  const shuffledReview = shuffle(review, rng);
  const shuffledFresh = shuffle(fresh, rng);
  // Perto de evoluir primeiro, para gerar satisfação de progresso.
  const shuffledInProgress = shuffle(inProgress, rng).sort(
    (a, b) =>
      pointsToNextLevel(progress.countries[a]?.masteryPoints ?? 0) -
      pointsToNextLevel(progress.countries[b]?.masteryPoints ?? 0),
  );

  const hasHistory = review.length > 0 || inProgress.length > 0;
  const selected: string[] = [];
  const take = (bucket: string[], count: number) => {
    while (count > 0 && bucket.length > 0) {
      const id = bucket.shift();
      if (id !== undefined) {
        selected.push(id);
        count--;
      }
    }
  };

  if (hasHistory) {
    take(shuffledReview, Math.round(size * 0.4));
    take(shuffledFresh, Math.round(size * 0.3));
    take(shuffledInProgress, size - selected.length);
  }
  // Preenche o restante (ou tudo, sem histórico) priorizando descoberta.
  take(shuffledFresh, size - selected.length);
  take(shuffledInProgress, size - selected.length);
  take(shuffledReview, size - selected.length);

  // Conjunto menor que a sessão: repete países em ciclos embaralhados.
  if (selected.length < size && selected.length > 0) {
    let cycle = shuffle(selected, rng);
    while (selected.length < size) {
      if (cycle.length === 0) {
        cycle = shuffle([...new Set(selected)], rng);
      }
      const id = cycle.shift();
      if (id !== undefined) {
        selected.push(id);
      }
    }
  }

  return shuffle(selected, rng).slice(0, size);
}
