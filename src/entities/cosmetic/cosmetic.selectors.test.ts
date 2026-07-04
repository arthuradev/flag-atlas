import { describe, expect, it } from "vitest";
import {
  canPurchaseCosmetic,
  equipCosmetic,
  getEquippedCosmetics,
  getEquippedId,
  getOwnedCosmetics,
  isCosmeticOwned,
  normalizeCosmeticInventory,
  purchaseCosmetic,
} from "./cosmetic.selectors";
import { type CosmeticInventory, createInitialCosmeticInventory } from "./cosmetic.types";

function inventory(overrides: Partial<CosmeticInventory> = {}): CosmeticInventory {
  return { ...createInitialCosmeticInventory(), ...overrides };
}

describe("ownership", () => {
  it("treats free items as always owned", () => {
    expect(isCosmeticOwned(inventory(), "theme-default")).toBe(true);
    expect(isCosmeticOwned(inventory(), "sound-silent")).toBe(true);
  });

  it("treats paid items as owned only when purchased", () => {
    expect(isCosmeticOwned(inventory(), "theme-oceano")).toBe(false);
    expect(isCosmeticOwned(inventory({ ownedItemIds: ["theme-oceano"] }), "theme-oceano")).toBe(
      true,
    );
  });

  it("includes free items in the owned list", () => {
    const owned = getOwnedCosmetics(inventory()).map((item) => item.id);
    expect(owned).toContain("theme-default");
    expect(owned).not.toContain("theme-oceano");
  });
});

describe("purchase", () => {
  it("allows purchase with enough coins", () => {
    const start = inventory({ coins: 200 });
    expect(canPurchaseCosmetic(start, "theme-oceano")).toEqual({ ok: true });
    const next = purchaseCosmetic(start, "theme-oceano");
    expect(next.coins).toBe(200 - 120);
    expect(next.ownedItemIds).toContain("theme-oceano");
  });

  it("blocks purchase without enough coins", () => {
    const start = inventory({ coins: 10 });
    expect(canPurchaseCosmetic(start, "theme-oceano")).toEqual({
      ok: false,
      reason: "insufficientCoins",
    });
    const next = purchaseCosmetic(start, "theme-oceano");
    expect(next).toEqual(start);
  });

  it("blocks buying the same item twice", () => {
    const start = inventory({ coins: 500, ownedItemIds: ["theme-oceano"] });
    expect(canPurchaseCosmetic(start, "theme-oceano")).toEqual({
      ok: false,
      reason: "alreadyOwned",
    });
    const next = purchaseCosmetic(start, "theme-oceano");
    expect(next.coins).toBe(500);
    expect(next.ownedItemIds.filter((id) => id === "theme-oceano")).toHaveLength(1);
  });

  it("reports unknown items as notFound", () => {
    expect(canPurchaseCosmetic(inventory({ coins: 999 }), "nope")).toEqual({
      ok: false,
      reason: "notFound",
    });
  });

  it("never lets coins go negative", () => {
    const start = inventory({ coins: 0 });
    const next = purchaseCosmetic(start, "theme-neon");
    expect(next.coins).toBe(0);
  });
});

describe("equip", () => {
  it("equips an owned paid item", () => {
    const start = inventory({ ownedItemIds: ["theme-oceano"] });
    const next = equipCosmetic(start, "theme-oceano");
    expect(next.equipped.themeId).toBe("theme-oceano");
  });

  it("equips a free item without owning it explicitly", () => {
    const next = equipCosmetic(inventory(), "sound-silent");
    expect(next.equipped.soundPackId).toBe("sound-silent");
  });

  it("does not equip an unowned item", () => {
    const start = inventory();
    const next = equipCosmetic(start, "theme-oceano");
    expect(next.equipped.themeId).toBe("theme-default");
    expect(next).toEqual(start);
  });

  it("does not equip an unknown item", () => {
    const start = inventory({ ownedItemIds: ["theme-oceano"], coins: 5 });
    expect(equipCosmetic(start, "ghost")).toEqual(start);
  });

  it("equipping does not spend coins", () => {
    const start = inventory({ coins: 50, ownedItemIds: ["mascot-globe"] });
    const next = equipCosmetic(start, "mascot-globe");
    expect(next.coins).toBe(50);
  });
});

describe("equipped resolution", () => {
  it("falls back to default when the equipped item is invalid", () => {
    const start = inventory();
    start.equipped.themeId = "theme-ghost";
    expect(getEquippedId(start, "theme")).toBe("theme-default");
  });

  it("falls back to default when the equipped item is no longer owned", () => {
    const start = inventory();
    start.equipped.flagFrameId = "frame-neon"; // paid, but not owned
    expect(getEquippedId(start, "flagFrame")).toBe("frame-default");
  });

  it("returns a resolvable item for every type", () => {
    const equipped = getEquippedCosmetics(inventory());
    expect(equipped.theme.id).toBe("theme-default");
    expect(equipped.soundPack.id).toBe("sound-default");
    expect(equipped.flagFrame.id).toBe("frame-default");
    expect(equipped.mascot.id).toBe("mascot-none");
    expect(equipped.visualEffect.id).toBe("effect-none");
  });
});

describe("normalizeCosmeticInventory", () => {
  it("returns safe defaults for missing/corrupted data", () => {
    expect(normalizeCosmeticInventory(undefined)).toEqual(createInitialCosmeticInventory());
    expect(normalizeCosmeticInventory("garbage")).toEqual(createInitialCosmeticInventory());
    expect(normalizeCosmeticInventory(null)).toEqual(createInitialCosmeticInventory());
  });

  it("clamps invalid coins to 0", () => {
    expect(normalizeCosmeticInventory({ coins: -50 }).coins).toBe(0);
    expect(normalizeCosmeticInventory({ coins: "lots" }).coins).toBe(0);
    expect(normalizeCosmeticInventory({ coins: 42.9 }).coins).toBe(42);
  });

  it("drops unknown and duplicate owned ids", () => {
    const result = normalizeCosmeticInventory({
      coins: 10,
      ownedItemIds: ["theme-oceano", "theme-oceano", "ghost", 5],
    });
    expect(result.ownedItemIds).toEqual(["theme-oceano"]);
  });

  it("keeps a valid equipped item that is owned", () => {
    const result = normalizeCosmeticInventory({
      coins: 0,
      ownedItemIds: ["theme-oceano"],
      equipped: { themeId: "theme-oceano" },
    });
    expect(result.equipped.themeId).toBe("theme-oceano");
  });

  it("resets an equipped item that is not owned back to default", () => {
    const result = normalizeCosmeticInventory({
      coins: 0,
      ownedItemIds: [],
      equipped: { themeId: "theme-oceano", mascotId: "mascot-owl" },
    });
    expect(result.equipped.themeId).toBe("theme-default");
    expect(result.equipped.mascotId).toBe("mascot-none");
  });

  it("resets an equipped item of the wrong type back to default", () => {
    const result = normalizeCosmeticInventory({
      equipped: { themeId: "sound-default" },
    });
    expect(result.equipped.themeId).toBe("theme-default");
  });

  it("keeps free equipped items even without explicit ownership", () => {
    const result = normalizeCosmeticInventory({
      equipped: { soundPackId: "sound-silent" },
    });
    expect(result.equipped.soundPackId).toBe("sound-silent");
  });
});
