import { describe, expect, it } from "vitest";
import { getCountryById } from "@/entities/country/country.selectors";
import { COUNTRIES } from "@/shared/data/countries";
import { createRng } from "@/shared/utils/rng";
import { generateOptions, OPTIONS_PER_QUESTION } from "./generateOptions";

describe("generateOptions", () => {
  it("always includes the correct answer among 4 unique options", () => {
    const rng = createRng(42);
    for (const correct of COUNTRIES) {
      const options = generateOptions({ correct, pool: COUNTRIES, rng });
      expect(options).toHaveLength(OPTIONS_PER_QUESTION);
      expect(new Set(options).size).toBe(OPTIONS_PER_QUESTION);
      expect(options).toContain(correct.id);
    }
  });

  it("includes at least one wrong option from the same continent when possible", () => {
    const rng = createRng(7);
    const brazil = COUNTRIES.find((country) => country.id === "br");
    if (!brazil) {
      throw new Error("missing br in dataset");
    }
    for (let i = 0; i < 25; i++) {
      const options = generateOptions({ correct: brazil, pool: COUNTRIES, rng });
      const wrongSameContinent = options.filter((id) => {
        const country = getCountryById(id);
        return id !== brazil.id && country?.continentId === brazil.continentId;
      });
      expect(wrongSameContinent.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("shuffles the position of the correct answer", () => {
    const rng = createRng(123);
    const japan = COUNTRIES.find((country) => country.id === "jp");
    if (!japan) {
      throw new Error("missing jp in dataset");
    }
    const positions = new Set<number>();
    for (let i = 0; i < 40; i++) {
      const options = generateOptions({ correct: japan, pool: COUNTRIES, rng });
      positions.add(options.indexOf(japan.id));
    }
    expect(positions.size).toBeGreaterThan(1);
  });

  it("is deterministic for the same seed", () => {
    const vatican = COUNTRIES.find((country) => country.id === "va");
    if (!vatican) {
      throw new Error("missing va in dataset");
    }
    const a = generateOptions({ correct: vatican, pool: COUNTRIES, rng: createRng(5) });
    const b = generateOptions({ correct: vatican, pool: COUNTRIES, rng: createRng(5) });
    expect(a).toEqual(b);
  });
});
