import type { ContinentId } from "@/entities/continent/continent.types";
import type { Country } from "@/entities/country/country.types";
import { COUNTRIES } from "@/shared/data/countries";
import type { Locale } from "@/shared/i18n/locale";

const COUNTRY_BY_ID = new Map(COUNTRIES.map((country) => [country.id, country]));

export function getCountryById(id: string): Country | undefined {
  return COUNTRY_BY_ID.get(id);
}

export function getCountryName(country: Country, locale: Locale): string {
  return country.names[locale];
}

export function listCountriesByContinent(continentId: ContinentId): Country[] {
  return COUNTRIES.filter((country) => country.continentId === continentId);
}
