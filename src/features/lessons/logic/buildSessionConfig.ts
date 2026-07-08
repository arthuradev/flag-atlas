import { resolveExercise } from "@/entities/exercise/exercise.mapping";
import type { LessonExerciseSpec } from "@/entities/lesson/lesson.types";
import type { SessionConfig, SessionMode } from "@/entities/session/session.types";

/**
 * Traduz um exercício de lição para o SessionConfig do pipeline existente.
 * mode/questionType legados são derivados para manter recompensas,
 * missões e persistência intactas.
 *
 * Limitação herdada do modelo legado (mode é único): o modificador
 * survival tem precedência — combinado com continentId, o pool não é
 * restrito ao continente.
 */
export function buildSessionConfigForExercise(spec: LessonExerciseSpec): SessionConfig {
  const { format, selection } = resolveExercise(spec.exerciseType);
  const mode: SessionMode = spec.modifiers?.survival
    ? "survival"
    : selection === "similar"
      ? "similar"
      : selection === "review"
        ? "review"
        : spec.continentId !== undefined
          ? "continent"
          : "continue";

  return {
    mode,
    questionType: format === "typing" ? "typing" : "choice",
    exerciseType: spec.exerciseType,
    ...(spec.continentId !== undefined && { continentId: spec.continentId }),
    ...(spec.similarGroupId !== undefined && { similarGroupId: spec.similarGroupId }),
    size: spec.size,
  };
}
