/**
 * Vocabulário de produto para os exercícios das lições. Cada ExerciseType
 * combina dois eixos internos ortogonais:
 *
 * - formato (por pergunta): como a pergunta é apresentada e respondida;
 * - seleção (por sessão): como os países da sessão são escolhidos.
 *
 * "similar_flags" e "review" são estratégias de seleção com formato padrão;
 * os demais são formatos com seleção padrão. Sobrevivência NÃO é um
 * ExerciseType: é um modificador de sessão (vidas na regra de término),
 * ortogonal ao formato — segue como SessionMode "survival".
 */
export type ExerciseType =
  | "flag_to_country"
  | "country_to_flag"
  | "typing"
  | "similar_flags"
  | "review";

/** Como a pergunta é apresentada e respondida (por pergunta). */
export type ExerciseFormat = "flag_to_country" | "country_to_flag" | "typing";

/** Como os países da sessão são escolhidos (por sessão). */
export type SelectionStrategy = "standard" | "continent" | "review" | "similar";

export type ExerciseBlueprint = {
  format: ExerciseFormat;
  selection: SelectionStrategy;
};
