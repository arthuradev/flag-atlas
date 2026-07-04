import type { HTMLAttributes, ReactNode } from "react";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

type ChipTone = "neutral" | "primary" | "accent" | "success" | "danger";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
  children: ReactNode;
  icon?: IconName;
  tone?: ChipTone;
};

const TONE_CLASSES: Record<ChipTone, { active: string; idle: string }> = {
  neutral: {
    active: "border-line-strong bg-ink text-background",
    idle: "border-line bg-surface text-ink-2",
  },
  primary: {
    active: "border-primary bg-primary text-primary-foreground",
    idle: "border-line bg-pine-soft text-primary",
  },
  accent: {
    active: "border-ocre bg-ocre text-white",
    idle: "border-ocre/35 bg-ocre-soft text-ocre-ink",
  },
  success: {
    active: "border-success bg-success text-white",
    idle: "border-success/30 bg-success-soft text-success",
  },
  danger: {
    active: "border-danger bg-danger text-white",
    idle: "border-danger/30 bg-danger-soft text-danger",
  },
};

export function Chip({
  active = false,
  children,
  className = "",
  icon,
  tone = "neutral",
  ...rest
}: ChipProps) {
  const toneClass = active ? TONE_CLASSES[tone].active : TONE_CLASSES[tone].idle;

  return (
    <span
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-chip border px-3 py-1.5 text-sm font-extrabold leading-none ${toneClass} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={15} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
