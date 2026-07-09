import { describe, expect, it } from "vitest";
import enUS from "@/shared/i18n/locales/en-US.json";
import ptBR from "@/shared/i18n/locales/pt-BR.json";
import { COSMETIC_CATALOG } from "./cosmetic.catalog";
import {
  equipCosmetic,
  getEquippedId,
  normalizeCosmeticInventory,
  purchaseCosmetic,
} from "./cosmetic.selectors";
import {
  COSMETIC_TYPES,
  type CosmeticInventory,
  createInitialCosmeticInventory,
  DEFAULT_COSMETIC_IDS,
} from "./cosmetic.types";
import { SHOP_CATEGORIES, SHOP_CATEGORY_TYPE } from "./shop.categories";

function resolveKey(bundle: unknown, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        typeof node === "object" && node !== null
          ? (node as Record<string, unknown>)[part]
          : undefined,
      bundle,
    );
}

describe("shop categories", () => {
  it("maps every visual category to a valid cosmetic type", () => {
    for (const category of SHOP_CATEGORIES) {
      expect(COSMETIC_TYPES).toContain(SHOP_CATEGORY_TYPE[category]);
    }
  });

  it("keeps gameplay-neutral: sounds and effects have no shop category", () => {
    const shopTypes = SHOP_CATEGORIES.map((category) => SHOP_CATEGORY_TYPE[category]);
    expect(shopTypes).not.toContain("soundPack");
    expect(shopTypes).not.toContain("visualEffect");
  });

  it("has a representative catalog per shop category", () => {
    const minimums: Record<(typeof SHOP_CATEGORIES)[number], number> = {
      orbi: 10,
      avatar: 12,
      themes: 8,
      frames: 10,
    };
    for (const category of SHOP_CATEGORIES) {
      const type = SHOP_CATEGORY_TYPE[category];
      const count = COSMETIC_CATALOG.filter((item) => item.type === type).length;
      expect(count, `category ${category}`).toBeGreaterThanOrEqual(minimums[category]);
    }
  });
});

describe("catalog i18n coverage", () => {
  it.each(["pt-BR", "en-US"] as const)("%s names every catalog item", (locale) => {
    const bundle = locale === "pt-BR" ? ptBR : enUS;
    for (const item of COSMETIC_CATALOG) {
      expect(typeof resolveKey(bundle, item.nameKey), item.nameKey).toBe("string");
      expect(typeof resolveKey(bundle, item.descriptionKey), item.descriptionKey).toBe("string");
    }
  });
});

describe("inventory compatibility with the pre-shop shape", () => {
  const legacyInventory = {
    coins: 250,
    ownedItemIds: ["theme-oceano", "frame-neon"],
    // Shape antigo: só os quatro tipos originais no equipped.
    equipped: {
      themeId: "theme-oceano",
      soundPackId: "sound-default",
      flagFrameId: "frame-neon",
      visualEffectId: "effect-none",
    },
  };

  it("keeps legacy coins, items and equipment", () => {
    const normalized = normalizeCosmeticInventory(legacyInventory);
    expect(normalized.coins).toBe(250);
    expect(normalized.ownedItemIds).toEqual(["theme-oceano", "frame-neon"]);
    expect(normalized.equipped.themeId).toBe("theme-oceano");
    expect(normalized.equipped.flagFrameId).toBe("frame-neon");
  });

  it("fills the new equipped slots with safe defaults", () => {
    const normalized = normalizeCosmeticInventory(legacyInventory);
    expect(normalized.equipped.orbiCosmeticId).toBe(DEFAULT_COSMETIC_IDS.orbiCosmetic);
    expect(normalized.equipped.avatarCosmeticId).toBe(DEFAULT_COSMETIC_IDS.avatarCosmetic);
  });

  it("buys and equips the new categories end to end", () => {
    let inventory: CosmeticInventory = {
      ...createInitialCosmeticInventory(),
      coins: 500,
    };

    inventory = purchaseCosmetic(inventory, "orbi-cap");
    expect(inventory.ownedItemIds).toContain("orbi-cap");
    inventory = equipCosmetic(inventory, "orbi-cap");
    expect(getEquippedId(inventory, "orbiCosmetic")).toBe("orbi-cap");

    inventory = purchaseCosmetic(inventory, "avatar-ocean");
    inventory = equipCosmetic(inventory, "avatar-ocean");
    expect(getEquippedId(inventory, "avatarCosmetic")).toBe("avatar-ocean");

    // As duas compras debitaram o saldo (120 + 90).
    expect(inventory.coins).toBe(500 - 120 - 90);
  });

  it("never lets an unowned item be equipped in the new slots", () => {
    const inventory = createInitialCosmeticInventory();
    const after = equipCosmetic(inventory, "orbi-crown");
    expect(getEquippedId(after, "orbiCosmetic")).toBe(DEFAULT_COSMETIC_IDS.orbiCosmetic);
  });
});
