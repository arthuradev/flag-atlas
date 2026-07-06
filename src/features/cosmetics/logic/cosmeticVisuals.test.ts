import { describe, expect, it } from "vitest";
import { flagFrameClass } from "./flagFrames";
import { soundFileForPack, soundPackDir } from "./soundPacks";
import { isSpecialTheme, resolveDataTheme } from "./themes";
import { resolveVisualEffectKind } from "./visualEffects";

describe("themes", () => {
  it("follows the light/dark preference for the default theme", () => {
    expect(resolveDataTheme("theme-default", "light", false)).toBe("light");
    expect(resolveDataTheme("theme-default", "dark", false)).toBe("dark");
  });

  it("follows the system preference for the default theme", () => {
    expect(resolveDataTheme("theme-default", "system", true)).toBe("dark");
    expect(resolveDataTheme("theme-default", "system", false)).toBe("light");
  });

  it("applies special themes regardless of preference", () => {
    expect(resolveDataTheme("theme-oceano", "light", false)).toBe("oceano");
    expect(resolveDataTheme("theme-espaco", "system", false)).toBe("espaco");
    expect(isSpecialTheme("theme-oceano")).toBe(true);
    expect(isSpecialTheme("theme-default")).toBe(false);
  });

  it("falls back to the preference for unknown themes", () => {
    expect(resolveDataTheme("theme-ghost", "dark", false)).toBe("dark");
  });
});

describe("sound packs", () => {
  it("resolves the default pack to the root sounds folder", () => {
    expect(soundFileForPack("sound-default", "click")).toBe("sounds/click.wav");
  });

  it("resolves alternative packs to their subfolder", () => {
    expect(soundFileForPack("sound-arcade", "success")).toBe("sounds/arcade/success.wav");
  });

  it("returns null for the silent pack", () => {
    expect(soundFileForPack("sound-silent", "error")).toBeNull();
    expect(soundPackDir("sound-silent")).toBeNull();
  });

  it("falls back to the default pack for unknown ids", () => {
    expect(soundFileForPack("sound-ghost", "click")).toBe("sounds/click.wav");
  });
});

describe("flag frames", () => {
  it("returns an empty class for the default frame", () => {
    expect(flagFrameClass("frame-default")).toBe("");
  });

  it("returns a decoration class for a known frame", () => {
    expect(flagFrameClass("frame-neon").length).toBeGreaterThan(0);
  });

  it("falls back to the default frame for unknown ids", () => {
    expect(flagFrameClass("frame-ghost")).toBe("");
  });
});

describe("visual effects", () => {
  it("resolves known effects", () => {
    expect(resolveVisualEffectKind("effect-confetti", false)).toBe("confetti");
    expect(resolveVisualEffectKind("effect-none", false)).toBe("none");
  });

  it("disables effects under reduced motion", () => {
    expect(resolveVisualEffectKind("effect-confetti", true)).toBe("none");
    expect(resolveVisualEffectKind("effect-stars", true)).toBe("none");
  });

  it("falls back to none for unknown effects", () => {
    expect(resolveVisualEffectKind("effect-ghost", false)).toBe("none");
  });
});
