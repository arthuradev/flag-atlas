import type { Country } from "@/entities/country/country.types";
import { type Rng, shuffle } from "@/shared/utils/rng";

export const OPTIONS_PER_QUESTION = 4;

type GenerateOptionsParams = {
  correct: Country;
  pool: readonly Country[];
  rng: Rng;
};

/**
 * Gera as 4 alternativas de uma pergunta: a correta, pelo menos 1 errada do
 * mesmo continente quando possível, sem repetições, em ordem embaralhada.
 */
export function generateOptions({ correct, pool, rng }: GenerateOptionsParams): string[] {
  const wrongCandidates = pool.filter((country) => country.id !== correct.id);
  const sameContinent = wrongCandidates.filter(
    (country) => country.continentId === correct.continentId,
  );

  const wrongs: string[] = [];
  const used = new Set<string>([correct.id]);

  const pushFrom = (candidates: readonly Country[], count: number) => {
    for (const country of shuffle(candidates, rng)) {
      if (wrongs.length >= OPTIONS_PER_QUESTION - 1 || count <= 0) {
        return;
      }
      if (!used.has(country.id)) {
        used.add(country.id);
        wrongs.push(country.id);
        count--;
      }
    }
  };

  pushFrom(sameContinent, 1);
  pushFrom(wrongCandidates, OPTIONS_PER_QUESTION - 1 - wrongs.length);

  return shuffle([correct.id, ...wrongs], rng);
}
