import type { Locale } from "@/shared/i18n/locale";

export const CONTINENT_IDS = ["america", "europe", "africa", "asia", "oceania"] as const;

export type ContinentId = (typeof CONTINENT_IDS)[number];

export function isContinentId(value: unknown): value is ContinentId {
  return CONTINENT_IDS.includes(value as ContinentId);
}

export type Continent = {
  id: ContinentId;
  names: Record<Locale, string>;
  emoji: string;
  order: number;
  countryIds: readonly string[];
};
