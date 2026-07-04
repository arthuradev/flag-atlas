import type { HTMLAttributes } from "react";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

export type DomainBadgeTier = "bronze" | "gold" | "none" | "platinum" | "silver";

type DomainBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  tier: DomainBadgeTier;
};

const SIZE_CLASSES = {
  sm: {
    badge: "h-8 w-7",
    icon: 15,
    label: "text-xs",
    wrap: "gap-1.5",
  },
  md: {
    badge: "h-10 w-9",
    icon: 18,
    label: "text-sm",
    wrap: "gap-2",
  },
  lg: {
    badge: "h-[3.75rem] w-[3.25rem]",
    icon: 24,
    label: "text-sm",
    wrap: "gap-2.5",
  },
} as const;

const TIER_CLASSES: Record<DomainBadgeTier, { icon: IconName; shield: string; text: string }> = {
  none: {
    icon: "shield",
    shield: "bg-line text-faint",
    text: "text-muted",
  },
  bronze: {
    icon: "shield",
    shield: "bg-gradient-to-br from-[#c88a52] to-[#96602f] text-[#f3e6d4]",
    text: "text-[#8a572a]",
  },
  silver: {
    icon: "shield",
    shield: "bg-gradient-to-br from-[#ced6db] to-[#98a3aa] text-[#3f4a50]",
    text: "text-[#58646b]",
  },
  gold: {
    icon: "shield-check",
    shield: "bg-gradient-to-br from-[#ecc158] to-[#c1901f] text-[#5a4413]",
    text: "text-[#8b650e]",
  },
  platinum: {
    icon: "gem",
    shield: "bg-gradient-to-br from-[#7fd7ff] to-[#34c07d] text-[#0f2b22]",
    text: "text-[#1f7a4d]",
  },
};

const HEXAGON_CLIP_PATH = "polygon(50% 0, 100% 22%, 100% 68%, 50% 100%, 0 68%, 0 22%)";

export function DomainBadge({
  className = "",
  label,
  showLabel = false,
  size = "md",
  tier,
  ...rest
}: DomainBadgeProps) {
  const tierStyle = TIER_CLASSES[tier];
  const sizeStyle = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-flex shrink-0 items-center font-extrabold ${sizeStyle.wrap} ${tierStyle.text} ${className}`}
      role="img"
      aria-label={label}
      title={label}
      {...rest}
    >
      <span
        className={`inline-flex items-center justify-center shadow-sm ring-2 ring-white/75 ${sizeStyle.badge} ${tierStyle.shield}`}
        style={{ clipPath: HEXAGON_CLIP_PATH }}
      >
        <Icon name={tierStyle.icon} size={sizeStyle.icon} strokeWidth={2.2} />
      </span>
      {showLabel && label && <span className={sizeStyle.label}>{label}</span>}
    </span>
  );
}
