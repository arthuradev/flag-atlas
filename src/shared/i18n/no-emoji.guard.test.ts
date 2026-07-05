import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Anti-regression guard: no emoji in product UI or user-facing strings.
 *
 * The product's visual language is the <Icon> system (src/shared/components/Icon.tsx),
 * not emoji. This test fails the build if an emoji sneaks back into a source file
 * (.ts/.tsx) or a locale bundle (.json), so "just drop a 🌍 here" can't regress
 * the design by accident.
 *
 * Covers pictographic + flag + dingbat + variation-selector ranges. Plain text,
 * punctuation, and accented Latin (Português) are untouched.
 */
// Combining marks (variation selector, ZWJ, keycap) live in an alternation rather
// than inside the class, so they aren't misread as decorating an adjacent base char.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{2600}-\u{26FF}]|\u{FE0F}|\u{200D}|\u{20E3}/u;

const SCAN_ROOTS = ["src"];
const SCAN_EXT = /\.(ts|tsx|json)$/;
// The guard test itself contains the regex + sample emoji in comments; skip it.
const IGNORE = /no-emoji\.guard\.test\.ts$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.test(full) && !IGNORE.test(full)) out.push(full);
  }
  return out;
}

describe("no emoji in UI or user-facing strings", () => {
  const files = SCAN_ROOTS.flatMap((root) => walk(root));

  it("scans a non-trivial number of files", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)("%s has no emoji", (file) => {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    const offenders: string[] = [];

    lines.forEach((line, i) => {
      if (EMOJI_RE.test(line)) offenders.push(`  L${i + 1}: ${line.trim().slice(0, 80)}`);
    });

    expect(
      offenders,
      `Emoji found in ${file} — use the <Icon> component or an IconName instead:\n${offenders.join("\n")}`,
    ).toHaveLength(0);
  });
});
