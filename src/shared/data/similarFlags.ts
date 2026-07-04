/**
 * Grupos manuais de bandeiras visualmente parecidas para o desafio
 * "Bandeiras parecidas". Curadoria pequena de propósito: qualidade
 * acima de quantidade (.specs/SESSION_ALGORITHM.md).
 */
export type SimilarFlagGroup = {
  id: string;
  countryIds: readonly string[];
};

export const SIMILAR_FLAG_GROUPS: readonly SimilarFlagGroup[] = [
  { id: "chad-romania", countryIds: ["td", "ro"] },
  { id: "indonesia-monaco", countryIds: ["id", "mc"] },
  { id: "ireland-ivory-coast", countryIds: ["ie", "ci"] },
  { id: "australia-new-zealand", countryIds: ["au", "nz"] },
  { id: "slovakia-slovenia", countryIds: ["sk", "si"] },
  { id: "pan-african", countryIds: ["gn", "ml", "sn", "cm"] },
  { id: "netherlands-luxembourg", countryIds: ["nl", "lu"] },
  { id: "moldova-andorra", countryIds: ["md", "ad"] },
  { id: "gran-colombia", countryIds: ["co", "ec", "ve"] },
  { id: "pan-arab", countryIds: ["sy", "iq", "eg", "ye"] },
];

export function getSimilarGroupById(groupId: string): SimilarFlagGroup | undefined {
  return SIMILAR_FLAG_GROUPS.find((group) => group.id === groupId);
}

/** União de todos os países presentes em algum grupo, sem repetição. */
export function listSimilarCountryIds(): string[] {
  return [...new Set(SIMILAR_FLAG_GROUPS.flatMap((group) => [...group.countryIds]))];
}

/** Países parecidos com o dado (peers de todos os grupos em que ele aparece). */
export function getSimilarPeerIds(countryId: string): string[] {
  const peers = new Set<string>();
  for (const group of SIMILAR_FLAG_GROUPS) {
    if (group.countryIds.includes(countryId)) {
      for (const id of group.countryIds) {
        if (id !== countryId) {
          peers.add(id);
        }
      }
    }
  }
  return [...peers];
}
