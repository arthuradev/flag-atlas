import { describe, expect, it } from "vitest";
import { COSMETIC_CATALOG } from "./cosmetic.catalog";
import { COSMETIC_RARITIES, COSMETIC_TYPES, DEFAULT_COSMETIC_IDS } from "./cosmetic.types";

describe("cosmetic catalog", () => {
  it("has unique ids", () => {
    const ids = COSMETIC_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only valid types", () => {
    for (const item of COSMETIC_CATALOG) {
      expect(COSMETIC_TYPES).toContain(item.type);
    }
  });

  it("uses only valid rarities when present", () => {
    for (const item of COSMETIC_CATALOG) {
      if (item.rarity !== undefined) {
        expect(COSMETIC_RARITIES).toContain(item.rarity);
      }
    }
  });

  it("never has a negative price", () => {
    for (const item of COSMETIC_CATALOG) {
      expect(item.price).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(item.price)).toBe(true);
    }
  });

  it("has i18n keys for every item", () => {
    for (const item of COSMETIC_CATALOG) {
      expect(item.nameKey.length).toBeGreaterThan(0);
      expect(item.descriptionKey.length).toBeGreaterThan(0);
    }
  });

  it("has exactly one default per type, always free", () => {
    for (const type of COSMETIC_TYPES) {
      const defaults = COSMETIC_CATALOG.filter((item) => item.type === type && item.isDefault);
      expect(defaults).toHaveLength(1);
      expect(defaults[0]?.price).toBe(0);
      expect(defaults[0]?.id).toBe(DEFAULT_COSMETIC_IDS[type]);
    }
  });

  it("keeps every default id resolvable in the catalog", () => {
    for (const type of COSMETIC_TYPES) {
      const id = DEFAULT_COSMETIC_IDS[type];
      expect(COSMETIC_CATALOG.some((item) => item.id === id)).toBe(true);
    }
  });
});
