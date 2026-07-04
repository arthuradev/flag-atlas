import { useTranslation } from "react-i18next";
import type { MasteryLevel } from "@/entities/progress/progress.types";
import { MASTERY_BADGE_META } from "@/features/progress/logic/mastery";

type MasteryBadgeProps = {
  masteryLevel: MasteryLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showTier?: boolean;
  className?: string;
};

const SIZE_CLASSES = {
  sm: "gap-1 px-2 py-0.5 text-[0.7rem]",
  md: "gap-1.5 px-2.5 py-1 text-xs",
  lg: "gap-2 px-3 py-1.5 text-sm",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

const BADGE_CLASSES: Record<MasteryLevel, string> = {
  new: "border-border bg-border/35 text-text-muted shadow-none",
  recognized: "border-[#a86534] bg-[#f4c19a] text-[#52280f] shadow-sm",
  learned: "border-[#a8b3c1] bg-[#eef2f7] text-[#2c3a4c] shadow-sm",
  dominated: "border-[#d49b1f] bg-[#ffe49b] text-[#5a3a00] shadow-sm shadow-warning/15",
  master:
    "border-[#79d8ea] bg-gradient-to-br from-white via-[#dff9ff] to-[#b9e7ff] text-[#0d3f58] shadow-md shadow-primary/20",
};

function MedalIcon({ level, className }: { level: MasteryLevel; className: string }) {
  const centerFill = level === "new" ? "currentColor" : "white";
  const polygonPoints =
    level === "master"
      ? "12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9"
      : "12 3 15 9 21 10 16.5 14.5 17.5 21 12 18 6.5 21 7.5 14.5 3 10 9 9";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      {level === "new" && <path d="M6 12h12" />}
      {level !== "new" && (
        <>
          <polygon points={polygonPoints} fill={centerFill} fillOpacity="0.82" />
          <circle cx="12" cy="12" r={level === "master" ? "2.4" : "2"} fill="currentColor" />
        </>
      )}
    </svg>
  );
}

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
      className={`inline-flex shrink-0 items-center rounded-full border font-extrabold leading-none ${SIZE_CLASSES[size]} ${BADGE_CLASSES[masteryLevel]} ${className}`}
      role="img"
      aria-label={showTier ? `${tierLabel}: ${label}` : label}
      title={showTier ? `${tierLabel}: ${label}` : label}
    >
      <MedalIcon level={masteryLevel} className={ICON_SIZE_CLASSES[size]} />
      {showLabel && <span>{text}</span>}
    </span>
  );
}
