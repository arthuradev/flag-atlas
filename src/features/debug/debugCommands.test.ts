import { beforeEach, describe, expect, it } from "vitest";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { runDebugCommand } from "./debugCommands";

describe("runDebugCommand (dev tool)", () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it("adds and clamps coins", () => {
    runDebugCommand("coins 100");
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(100);
    runDebugCommand("coins -30");
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(70);
    runDebugCommand("coins -999");
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(0);
  });

  it("sets coins exactly", () => {
    runDebugCommand("setcoins 250");
    expect(useProgressStore.getState().progress.cosmetics.coins).toBe(250);
  });

  it("adds XP and recomputes the level", () => {
    runDebugCommand("xp 250");
    const progress = useProgressStore.getState().progress;
    expect(progress.totalXp).toBe(250);
    expect(progress.level).toBe(3);
  });

  it("unlocks a cosmetic without paying", () => {
    runDebugCommand("unlock theme-oceano");
    expect(useProgressStore.getState().progress.cosmetics.ownedItemIds).toContain("theme-oceano");
  });

  it("equips a cosmetic, unlocking it if needed", () => {
    runDebugCommand("equip theme-oceano");
    const cosmetics = useProgressStore.getState().progress.cosmetics;
    expect(cosmetics.ownedItemIds).toContain("theme-oceano");
    expect(cosmetics.equipped.themeId).toBe("theme-oceano");
  });

  it("unlocks every cosmetic", () => {
    runDebugCommand("unlockall");
    expect(useProgressStore.getState().progress.cosmetics.ownedItemIds.length).toBeGreaterThan(20);
  });

  it("reports unknown commands and items", () => {
    expect(runDebugCommand("nope")[0]).toContain("Comando desconhecido");
    expect(runDebugCommand("unlock ghost")[0]).toContain("Item desconhecido");
  });

  it("returns UI markers for clear and close", () => {
    expect(runDebugCommand("clear")).toEqual(["__clear__"]);
    expect(runDebugCommand("close")).toEqual(["__close__"]);
  });
});
