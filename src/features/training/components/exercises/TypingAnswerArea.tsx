import { TypedAnswerForm } from "@/features/training/components/TypedAnswerForm";

type TypingAnswerAreaProps = {
  /** Remonta o formulário a cada pergunta para limpar o valor digitado. */
  questionIndex: number;
  disabled: boolean;
  onSubmit: (typedAnswer: string) => void;
};

/** Área de resposta digitada: o jogador vê a bandeira e escreve o país. */
export function TypingAnswerArea({ questionIndex, disabled, onSubmit }: TypingAnswerAreaProps) {
  return <TypedAnswerForm key={questionIndex} disabled={disabled} onSubmit={onSubmit} />;
}
