import { describe, expect, it } from "vitest";
import { getCountryById } from "@/entities/country/country.selectors";
import { getSimilarPeerIds, listSimilarCountryIds, SIMILAR_FLAG_GROUPS } from "./similarFlags";

describe("similar flag groups", () => {
  it("only references countries that exist in the dataset", () => {
    for (const group of SIMILAR_FLAG_GROUPS) {
      for (const countryId of group.countryIds) {
        expect(getCountryById(countryId), `${group.id}: ${countryId}`).toBeDefined();
      }
    }
  });

  it("has at least 2 countries per group, without duplicates", () => {
    for (const group of SIMILAR_FLAG_GROUPS) {
      expect(group.countryIds.length, group.id).toBeGreaterThanOrEqual(2);
      expect(new Set(group.countryIds).size, group.id).toBe(group.countryIds.length);
    }
  });

  it("has unique group ids", () => {
    const ids = SIMILAR_FLAG_GROUPS.map((group) => group.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("lists the union of countries without duplicates", () => {
    const all = listSimilarCountryIds();
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it("returns the peers of a country from its group", () => {
    expect(getSimilarPeerIds("td")).toEqual(["ro"]);
    expect(getSimilarPeerIds("gn").sort()).toEqual(["cm", "ml", "sn"]);
    expect(getSimilarPeerIds("br")).toEqual([]);
  });
});
