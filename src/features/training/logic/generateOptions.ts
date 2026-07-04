import type { Country } from "@/entities/country/country.types";
import { type Rng, shuffle } from "@/shared/utils/rng";

export const OPTIONS_PER_QUESTION = 4;

type GenerateOptionsParams = {
  correct: Country;
  pool: readonly Country[];
  rng: Rng;
};

type GenerateSimilarOptionsParams = GenerateOptionsParams & {
  /** Ids de países parecidos com o correto, priorizados como alternativas erradas. */
  peerIds: readonly string[];
};

/**
 * Preenche alternativas erradas percorrendo camadas de candidatos em
 * ordem de prioridade, sem repetições, e devolve as 4 opções embaralhadas.
 */
function buildOptions(
  correct: Country,
  tiers: ReadonlyArray<readonly Country[]>,
  rng: Rng,
): string[] {
  const wrongs: string[] = [];
  const used = new Set<string>([correct.id]);

  for (const tier of tiers) {
    for (const country of shuffle(tier, rng)) {
      if (wrongs.length >= OPTIONS_PER_QUESTION - 1) {
        break;
      }
      if (!used.has(country.id)) {
        used.add(country.id);
        wrongs.push(country.id);
      }
    }
  }

  return shuffle([correct.id, ...wrongs], rng);
}

/**
 * Gera as 4 alternativas de uma pergunta: a correta, pelo menos 1 errada do
 * mesmo continente quando possível, sem repetições, em ordem embaralhada.
 */
export function generateOptions({ correct, pool, rng }: GenerateOptionsParams): string[] {
  const wrongCandidates = pool.filter((country) => country.id !== correct.id);
  const sameContinent = wrongCandidates.filter(
    (country) => country.continentId === correct.continentId,
  );
  // 1 vaga garantida para o mesmo continente, depois preenchimento global.
  const oneSameContinent = shuffle(sameContinent, rng).slice(0, 1);
  return buildOptions(correct, [oneSameContinent, wrongCandidates], rng);
}

/**
 * Variante para o desafio de bandeiras parecidas: alternativas erradas
 * priorizam os países do mesmo grupo; faltando, completa com o mesmo
 * continente e por fim com o restante do pool.
 */
export function generateSimilarOptions({
  correct,
  pool,
  peerIds,
  rng,
}: GenerateSimilarOptionsParams): string[] {
  const wrongCandidates = pool.filter((country) => country.id !== correct.id);
  const peerSet = new Set(peerIds);
  const peers = wrongCandidates.filter((country) => peerSet.has(country.id));
  const sameContinent = wrongCandidates.filter(
    (country) => country.continentId === correct.continentId,
  );
  return buildOptions(correct, [peers, sameContinent, wrongCandidates], rng);
}
