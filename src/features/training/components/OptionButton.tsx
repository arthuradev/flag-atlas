import { motion } from "motion/react";
import type { IconName } from "@/shared/components/Icon";
import { Icon } from "@/shared/components/Icon";

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

type OptionButtonProps = {
  disabled: boolean;
  label: string;
  onSelect: () => void;
  state: OptionState;
};

const STATE_CLASSES: Record<OptionState, string> = {
  idle: "border-line bg-surface text-text hover:border-line-strong hover:bg-surface-2 active:scale-[0.99]",
  correct: "border-success bg-success-soft text-success",
  wrong: "border-danger bg-danger-soft text-danger",
  dimmed: "border-line bg-background text-faint opacity-70",
};

const STATE_ICONS: Record<OptionState, IconName | null> = {
  idle: null,
  correct: "check-circle",
  wrong: "x-circle",
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
      className={`flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-btn border-2 px-6 py-3 text-left text-lg font-extrabold shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default sm:min-h-20 sm:text-xl ${STATE_CLASSES[state]}`}
    >
      <span>{label}</span>
      {icon && <Icon name={icon} size={22} strokeWidth={2.4} />}
    </motion.button>
  );
}
