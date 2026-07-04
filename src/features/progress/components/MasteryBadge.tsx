import { useTranslation } from "react-i18next";
import type { MasteryLevel } from "@/entities/progress/progress.types";
import { MASTERY_BADGE_META } from "@/features/progress/logic/mastery";
import { DomainBadge } from "@/shared/components/DomainBadge";

type MasteryBadgeProps = {
  masteryLevel: MasteryLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showTier?: boolean;
  className?: string;
};

const SIZE_CLASSES = {
  sm: "text-[0.7rem]",
  md: "text-xs",
  lg: "text-sm",
} as const;

const BADGE_CLASSES: Record<MasteryLevel, string> = {
  new: "border-line bg-line/35 text-muted",
  recognized: "border-[#c88a52]/35 bg-[#f7eadf] text-[#8a572a]",
  learned: "border-[#98a3aa]/35 bg-[#edf1f3] text-[#58646b]",
  dominated: "border-[#c1901f]/35 bg-[#fbf0cf] text-[#8b650e]",
  master: "border-platinum/35 bg-pine-soft text-primary",
};

export function MasteryBadge({
  masteryLevel,
  size = "md",
  showLabel = true,
  showTier = false,
  className = "",
}: MasteryBadgeProps) {
  const { t } = useTranslation();
  const tier = MASTERY_BADGE_META[masteryLevel].tier;
  const label = t(`mastery.${masteryLevel}`);
  const tierLabel = t(`mastery.badges.${tier}`);
  const text = showTier && tier !== "none" ? `${tierLabel} · ${label}` : label;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-chip border px-2 py-1 font-extrabold leading-none shadow-sm ${SIZE_CLASSES[size]} ${BADGE_CLASSES[masteryLevel]} ${className}`}
      role="img"
      aria-label={showTier ? `${tierLabel}: ${label}` : label}
      title={showTier ? `${tierLabel}: ${label}` : label}
    >
      <DomainBadge tier={tier} size={size} label={tierLabel} />
      {showLabel && <span>{text}</span>}
    </span>
  );
}
