import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const FLAGS_DIR = resolve(process.cwd(), "public", "flags");

/** Padrões proibidos em SVGs locais, conforme .specs/DATA_AND_ASSETS.md §9. */
const FORBIDDEN_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /\bonload\s*=/i,
  /\bonerror\s*=/i,
  /<foreignObject/i,
];

function listSvgFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => resolve(dir, file));
}

describe("svg security", () => {
  const allSvgs = [
    ...listSvgFiles(resolve(FLAGS_DIR, "mvp")),
    ...listSvgFiles(resolve(FLAGS_DIR, "extras")),
  ];

  it("scans all 254 flag SVGs", () => {
    expect(allSvgs).toHaveLength(254);
  });

  it("contains no forbidden patterns in any flag SVG", () => {
    for (const file of allSvgs) {
      const content = readFileSync(file, "utf8");
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(pattern.test(content), `${file} matches ${pattern}`).toBe(false);
      }
    }
  });
});
