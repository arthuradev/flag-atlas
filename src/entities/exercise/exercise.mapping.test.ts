import { describe, expect, it } from "vitest";
import type { SessionConfig } from "@/entities/session/session.types";
import { deriveExerciseType, resolveExercise, rewardAxesForExercise } from "./exercise.mapping";
import type { ExerciseType } from "./exercise.types";

function configOf(overrides: Partial<SessionConfig>): SessionConfig {
  return { mode: "continue", questionType: "choice", size: 10, ...overrides };
}

describe("resolveExercise", () => {
  it.each([
    ["flag_to_country", { format: "flag_to_country", selection: "standard" }],
    ["country_to_flag", { format: "country_to_flag", selection: "standard" }],
    ["typing", { format: "typing", selection: "standard" }],
    ["similar_flags", { format: "flag_to_country", selection: "similar" }],
    ["review", { format: "flag_to_country", selection: "review" }],
  ] as const)("decompoe %s em (formato, selecao)", (type, expected) => {
    expect(resolveExercise(type)).toEqual(expected);
  });
});

describe("deriveExerciseType", () => {
  it.each([
    [configOf({}), "flag_to_country"],
    [configOf({ mode: "continent", continentId: "america" }), "flag_to_country"],
    [configOf({ mode: "survival" }), "flag_to_country"],
    [configOf({ questionType: "typing" }), "typing"],
    [configOf({ mode: "similar" }), "similar_flags"],
    [configOf({ mode: "review" }), "review"],
  ] as const)("deriva o tipo de %o", (config, expected) => {
    expect(deriveExerciseType(config)).toBe(expected);
  });

  it("prioriza typing sobre o mode (sessao de digitacao em survival)", () => {
    expect(deriveExerciseType(configOf({ mode: "survival", questionType: "typing" }))).toBe(
      "typing",
    );
  });
});

describe("rewardAxesForExercise", () => {
  it.each([
    // [tipo, config, eixos legados esperados — exatamente o que o store passava antes]
    ["flag_to_country", configOf({}), { mode: "continue", questionType: "choice" }],
    [
      "flag_to_country",
      configOf({ mode: "continent", continentId: "america" }),
      { mode: "continent", questionType: "choice" },
    ],
    [
      "flag_to_country",
      configOf({ mode: "survival" }),
      { mode: "survival", questionType: "choice" },
    ],
    ["country_to_flag", configOf({}), { mode: "continue", questionType: "choice" }],
    ["typing", configOf({ questionType: "typing" }), { mode: "continue", questionType: "typing" }],
    [
      "typing",
      configOf({ mode: "survival", questionType: "typing" }),
      { mode: "survival", questionType: "typing" },
    ],
    ["similar_flags", configOf({ mode: "similar" }), { mode: "similar", questionType: "choice" }],
    ["review", configOf({ mode: "review" }), { mode: "review", questionType: "choice" }],
  ] as const)("%s mapeia para os eixos legados corretos", (type, config, expected) => {
    expect(rewardAxesForExercise(type, config)).toEqual(expected);
  });

  it("toda config legada faz roundtrip identico (derive -> rewardAxes)", () => {
    const legacyConfigs: SessionConfig[] = [
      configOf({}),
      configOf({ questionType: "typing" }),
      configOf({ mode: "similar" }),
      configOf({ mode: "review" }),
      configOf({ mode: "survival" }),
      configOf({ mode: "continent", continentId: "america" }),
    ];
    for (const config of legacyConfigs) {
      const type: ExerciseType = deriveExerciseType(config);
      expect(rewardAxesForExercise(type, config)).toEqual({
        mode: config.mode,
        questionType: config.questionType,
      });
    }
  });
});
