import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/Button";

type TypedAnswerFormProps = {
  disabled: boolean;
  onSubmit: (typedAnswer: string) => void;
};

/**
 * Input do modo digitação. O componente é remontado a cada pergunta
 * (key no pai), o que limpa o valor e devolve o foco ao input.
 */
export function TypedAnswerForm({ disabled, onSubmit }: TypedAnswerFormProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const canSubmit = !disabled && value.trim().length > 0;

  return (
    <form
      className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) {
          onSubmit(value);
        }
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        aria-label={t("typing.inputLabel")}
        placeholder={t("typing.placeholder")}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="min-h-14 w-full flex-1 rounded-2xl border-2 border-border bg-surface px-5 text-lg font-bold text-text placeholder:font-semibold placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 sm:min-h-16 sm:text-xl"
      />
      <Button type="submit" size="lg" disabled={!canSubmit} data-sound="off">
        {t("typing.submit")}
      </Button>
    </form>
  );
}
