import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTINENT_IDS, isContinentId } from "@/entities/continent/continent.types";
import { SUPPORTED_LOCALES } from "@/shared/i18n/locale";
import { CONTINENTS } from "./continents";
import { COUNTRIES } from "./countries";
import { EXTRA_FLAGS } from "./extras";

const PUBLIC_DIR = resolve(process.cwd(), "public");

const EXPECTED_CONTINENT_COUNTS: Record<string, number> = {
  america: 35,
  europe: 44,
  africa: 54,
  asia: 48,
  oceania: 14,
};

describe("countries dataset", () => {
  it("has exactly 195 countries", () => {
    expect(COUNTRIES).toHaveLength(195);
  });

  it("has unique country ids", () => {
    const ids = new Set(COUNTRIES.map((country) => country.id));
    expect(ids.size).toBe(COUNTRIES.length);
  });

  it("has a valid iso2 code for every country", () => {
    for (const country of COUNTRIES) {
      expect(country.iso2, country.id).toMatch(/^[A-Z]{2}$/);
      expect(country.iso2.toLowerCase()).toBe(country.id);
    }
  });

  it("has non-empty names in every supported locale", () => {
    for (const country of COUNTRIES) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(country.names[locale], `${country.id} ${locale}`).toBeTruthy();
      }
    }
  });

  it("uses friendly public names for special cases", () => {
    const byId = new Map(COUNTRIES.map((country) => [country.id, country]));
    expect(byId.get("va")?.names["pt-BR"]).toBe("Vaticano");
    expect(byId.get("cz")?.names["pt-BR"]).toBe("República Tcheca");
    expect(byId.get("tr")?.names["pt-BR"]).toBe("Turquia");
    expect(byId.get("tr")?.names["en-US"]).toBe("Turkey");
    expect(byId.get("us")?.names["pt-BR"]).toBe("Estados Unidos");
    expect(byId.get("gb")?.names["pt-BR"]).toBe("Reino Unido");
    expect(byId.get("kr")?.names["pt-BR"]).toBe("Coreia do Sul");
    expect(byId.get("kp")?.names["pt-BR"]).toBe("Coreia do Norte");
  });

  it("assigns every country to a valid continent", () => {
    for (const country of COUNTRIES) {
      expect(isContinentId(country.continentId), country.id).toBe(true);
    }
  });

  it("has a well-formed flagPath for every country", () => {
    for (const country of COUNTRIES) {
      expect(country.flagPath, country.id).toBe(`flags/mvp/${country.id}.svg`);
    }
  });

  it("has an existing SVG file for every flagPath", () => {
    for (const country of COUNTRIES) {
      expect(existsSync(resolve(PUBLIC_DIR, country.flagPath)), country.flagPath).toBe(true);
    }
  });

  it("has a non-empty slug for every country", () => {
    for (const country of COUNTRIES) {
      expect(country.slug, country.id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("continents dataset", () => {
  it("has exactly 5 continents", () => {
    expect(CONTINENTS).toHaveLength(5);
    expect(CONTINENTS.map((continent) => continent.id).sort()).toEqual([...CONTINENT_IDS].sort());
  });

  it("matches the official country counts per continent", () => {
    for (const continent of CONTINENTS) {
      expect(continent.countryIds, continent.id).toHaveLength(
        EXPECTED_CONTINENT_COUNTS[continent.id] ?? Number.NaN,
      );
    }
  });

  it("references only existing countries, covering all of them exactly once", () => {
    const countryIds = new Set(COUNTRIES.map((country) => country.id));
    const referenced = CONTINENTS.flatMap((continent) => [...continent.countryIds]);
    expect(referenced).toHaveLength(countryIds.size);
    expect(new Set(referenced).size).toBe(referenced.length);
    for (const id of referenced) {
      expect(countryIds.has(id), id).toBe(true);
    }
  });

  it("agrees with the continentId stored on each country", () => {
    const byId = new Map(COUNTRIES.map((country) => [country.id, country]));
    for (const continent of CONTINENTS) {
      for (const countryId of continent.countryIds) {
        expect(byId.get(countryId)?.continentId, countryId).toBe(continent.id);
      }
    }
  });

  it("has names in every supported locale", () => {
    for (const continent of CONTINENTS) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(continent.names[locale], `${continent.id} ${locale}`).toBeTruthy();
      }
    }
  });
});

describe("flag asset folders", () => {
  it("contains exactly 195 SVGs in public/flags/mvp", () => {
    const files = readdirSync(resolve(PUBLIC_DIR, "flags", "mvp"));
    expect(files.filter((file) => file.endsWith(".svg"))).toHaveLength(195);
  });

  it("contains exactly 59 SVGs in public/flags/extras", () => {
    const files = readdirSync(resolve(PUBLIC_DIR, "flags", "extras"));
    expect(files.filter((file) => file.endsWith(".svg"))).toHaveLength(59);
  });
});

describe("extra flags dataset", () => {
  it("has 59 extras kept out of the MVP", () => {
    expect(EXTRA_FLAGS).toHaveLength(59);
  });

  it("does not overlap with MVP country ids", () => {
    const countryIds = new Set(COUNTRIES.map((country) => country.id));
    for (const extra of EXTRA_FLAGS) {
      expect(countryIds.has(extra.id), extra.id).toBe(false);
    }
  });

  it("has an existing SVG file for every extra flag", () => {
    for (const extra of EXTRA_FLAGS) {
      expect(existsSync(resolve(PUBLIC_DIR, extra.flagPath)), extra.flagPath).toBe(true);
    }
  });
});
