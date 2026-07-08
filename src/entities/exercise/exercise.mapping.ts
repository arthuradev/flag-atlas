import type { QuestionType, SessionConfig, SessionMode } from "@/entities/session/session.types";
import type { ExerciseBlueprint, ExerciseType } from "./exercise.types";

const BLUEPRINTS: Record<ExerciseType, ExerciseBlueprint> = {
  flag_to_country: { format: "flag_to_country", selection: "standard" },
  country_to_flag: { format: "country_to_flag", selection: "standard" },
  typing: { format: "typing", selection: "standard" },
  similar_flags: { format: "flag_to_country", selection: "similar" },
  review: { format: "flag_to_country", selection: "review" },
};

/** Decompõe o tipo de exercício nos eixos internos (formato, seleção). */
export function resolveExercise(type: ExerciseType): ExerciseBlueprint {
  return BLUEPRINTS[type];
}

/**
 * Deriva o ExerciseType de uma SessionConfig legada (sem exerciseType).
 * Compat total: toda combinação mode/questionType existente tem um tipo.
 */
export function deriveExerciseType(config: SessionConfig): ExerciseType {
  if (config.questionType === "typing") {
    return "typing";
  }
  if (config.mode === "similar") {
    return "similar_flags";
  }
  if (config.mode === "review") {
    return "review";
  }
  return "flag_to_country";
}

/**
 * Eixos legados que mastery, missões, conquistas e moedas esperam.
 * Para toda sessão existente o resultado é idêntico ao que o store
 * passava antes — qualquer divergência aqui é regressão de recompensa.
 */
export function rewardAxesForExercise(
  type: ExerciseType,
  config: SessionConfig,
): { mode: SessionMode; questionType: QuestionType } {
  switch (type) {
    case "typing":
      return { mode: config.mode, questionType: "typing" };
    case "similar_flags":
      return { mode: "similar", questionType: "choice" };
    case "review":
      return { mode: "review", questionType: "choice" };
    default:
      // flag_to_country e country_to_flag preservam o mode da config
      // (continue/continent/survival) com o formato choice.
      return { mode: config.mode, questionType: "choice" };
  }
}
