import { describe, expect, it } from "vitest";
import { buildSessionConfigForExercise } from "./buildSessionConfig";

describe("buildSessionConfigForExercise", () => {
  it("traduz flag_to_country para o config continue/choice", () => {
    expect(buildSessionConfigForExercise({ exerciseType: "flag_to_country", size: 10 })).toEqual({
      mode: "continue",
      questionType: "choice",
      exerciseType: "flag_to_country",
      size: 10,
    });
  });

  it("traduz country_to_flag mantendo os eixos choice", () => {
    expect(buildSessionConfigForExercise({ exerciseType: "country_to_flag", size: 5 })).toEqual({
      mode: "continue",
      questionType: "choice",
      exerciseType: "country_to_flag",
      size: 5,
    });
  });

  it("traduz typing para questionType typing", () => {
    expect(buildSessionConfigForExercise({ exerciseType: "typing", size: 10 })).toEqual({
      mode: "continue",
      questionType: "typing",
      exerciseType: "typing",
      size: 10,
    });
  });

  it("traduz similar_flags para o mode similar, com grupo opcional", () => {
    expect(
      buildSessionConfigForExercise({
        exerciseType: "similar_flags",
        similarGroupId: "chad-romania",
        size: 10,
      }),
    ).toEqual({
      mode: "similar",
      questionType: "choice",
      exerciseType: "similar_flags",
      similarGroupId: "chad-romania",
      size: 10,
    });
  });

  it("traduz review para o mode review", () => {
    expect(buildSessionConfigForExercise({ exerciseType: "review", size: 10 })).toEqual({
      mode: "review",
      questionType: "choice",
      exerciseType: "review",
      size: 10,
    });
  });

  it("restringe ao continente quando ha continentId", () => {
    expect(
      buildSessionConfigForExercise({
        exerciseType: "flag_to_country",
        continentId: "oceania",
        size: 10,
      }),
    ).toEqual({
      mode: "continent",
      questionType: "choice",
      exerciseType: "flag_to_country",
      continentId: "oceania",
      size: 10,
    });
  });

  it("aplica o modificador survival como mode, com precedencia documentada", () => {
    const config = buildSessionConfigForExercise({
      exerciseType: "flag_to_country",
      continentId: "oceania",
      size: 10,
      modifiers: { survival: true },
    });
    expect(config.mode).toBe("survival");
    expect(config.questionType).toBe("choice");
    // Limitação herdada: survival vence a restrição de continente.
    expect(config.continentId).toBe("oceania");
  });

  it("combina survival com typing preservando o formato", () => {
    const config = buildSessionConfigForExercise({
      exerciseType: "typing",
      size: 10,
      modifiers: { survival: true },
    });
    expect(config.mode).toBe("survival");
    expect(config.questionType).toBe("typing");
    expect(config.exerciseType).toBe("typing");
  });
});
