import type { ContinentId } from "@/entities/continent/continent.types";
import type { ExerciseType } from "@/entities/exercise/exercise.types";
import type { SessionSize } from "@/entities/settings/settings.types";

/**
 * Um exercício dentro de uma lição. É a unidade que o produto monta:
 * o tipo diz o que o jogador faz; os modificadores mudam as regras da
 * sessão sem mudar o exercício (survival = vidas na regra de término).
 */
export type LessonExerciseSpec = {
  exerciseType: ExerciseType;
  size: SessionSize;
  /** Restringe o pool a um continente (trilhas por continente). */
  continentId?: ContinentId;
  /** Restringe o exercício similar_flags a um grupo específico. */
  similarGroupId?: string;
  modifiers?: {
    /** Vidas limitadas: a sessão termina ao esgotá-las. */
    survival?: boolean;
  };
};

/** Lição: sequência ordenada de exercícios. Sem UI/rota/store ainda. */
export type Lesson = {
  id: string;
  titleKey: string;
  exercises: readonly LessonExerciseSpec[];
};
