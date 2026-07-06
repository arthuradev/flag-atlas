import { useTranslation } from "react-i18next";
import { Globi } from "@/shared/components/Globi";

/**
 * The desktop-only brand column: Globi floating over a deep aqua field with a
 * faint globe, the wordmark and a one-line promise. Keeps the large-screen
 * onboarding feeling full and confident instead of a shrunken phone.
 */
type BrandPanelProps = {
  animate?: boolean;
  className?: string;
};

export function BrandPanel({ animate = true, className = "" }: BrandPanelProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`relative flex-col items-center justify-center gap-4 overflow-hidden p-9 ${className}`}
      style={{ background: "linear-gradient(160deg,#17B4C9,#0E8CA1)" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 400 440"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-50"
        fill="none"
        stroke="rgba(255,255,255,.18)"
        strokeWidth="1.4"
        aria-hidden={true}
      >
        <ellipse cx="200" cy="220" rx="230" ry="230" />
        <ellipse cx="200" cy="220" rx="150" ry="230" />
        <line x1="-40" y1="220" x2="440" y2="220" />
        <path d="M-40 150 Q200 190 440 150" />
        <path d="M-40 290 Q200 250 440 290" />
      </svg>
      <div className="relative size-40">
        <Globi tone="dark" expression="sorriso" float={animate} wave={animate} blink={animate} />
      </div>
      <div className="relative text-[34px] font-black leading-none tracking-tight text-white">
        Flag Atlas
      </div>
      <p className="relative m-0 max-w-[26ch] text-center text-sm font-semibold text-white/90">
        {t("onboarding.brandTagline")}
      </p>
    </div>
  );
}
