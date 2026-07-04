import type { HTMLAttributes, ReactNode } from "react";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

type ScoreCardTone = "default" | "accent" | "danger" | "dark" | "success";

type ScoreCardProps = HTMLAttributes<HTMLDivElement> & {
  icon?: IconName;
  label: ReactNode;
  tone?: ScoreCardTone;
  value: ReactNode;
};

const TONE_CLASSES: Record<ScoreCardTone, string> = {
  default: "border-line bg-surface text-text",
  accent: "border-ocre/35 bg-ocre-soft text-text",
  danger: "border-danger/30 bg-danger-soft text-text",
  dark: "border-transparent bg-ink text-background",
  success: "border-success/30 bg-success-soft text-text",
};

const ICON_CLASSES: Record<ScoreCardTone, string> = {
  default: "text-primary",
  accent: "text-ocre-ink",
  danger: "text-danger",
  dark: "text-platinum",
  success: "text-success",
};

export function ScoreCard({
  className = "",
  icon,
  label,
  tone = "default",
  value,
  ...rest
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-card border p-4 shadow-card ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-extrabold text-current/75">{label}</span>
        {icon && <Icon name={icon} size={20} className={ICON_CLASSES[tone]} />}
      </div>
      <div className="mt-2 text-3xl font-black leading-none">{value}</div>
    </div>
  );
}
