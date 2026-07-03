import { motion } from "motion/react";

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

type OptionButtonProps = {
  label: string;
  state: OptionState;
  disabled: boolean;
  onSelect: () => void;
};

const STATE_CLASSES: Record<OptionState, string> = {
  idle: "border-border bg-surface hover:bg-surface-raised active:scale-[0.99]",
  correct: "border-success bg-success/10 text-success",
  wrong: "border-danger bg-danger/10 text-danger",
  dimmed: "border-border bg-surface opacity-50",
};

const STATE_ICONS: Record<OptionState, string | null> = {
  idle: null,
  correct: "✓",
  wrong: "✗",
  dimmed: null,
};

export function OptionButton({ label, state, disabled, onSelect }: OptionButtonProps) {
  const icon = STATE_ICONS[state];

  return (
    <motion.button
      type="button"
      data-testid="training-option"
      data-state={state}
      onClick={onSelect}
      disabled={disabled}
      animate={state === "correct" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-6 py-3 text-left text-lg font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default sm:min-h-20 sm:text-xl ${STATE_CLASSES[state]}`}
    >
      <span>{label}</span>
      {icon && (
        <span aria-hidden="true" className="text-xl font-extrabold">
          {icon}
        </span>
      )}
    </motion.button>
  );
}
