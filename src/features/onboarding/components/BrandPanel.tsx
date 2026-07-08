import { useTranslation } from "react-i18next";
import { BrandImage } from "@/shared/brand/BrandImage";
import { Orbi } from "@/shared/brand/Orbi";
import { Icon } from "@/shared/components/Icon";

const SIDE_STEPS = [
  { key: "start", threshold: 1 },
  { key: "goal", threshold: 2 },
  { key: "lesson", threshold: 3 },
] as const;

/**
 * The desktop-only brand column: Orbi floating over a deep aqua field with a
 * faint globe, the wordmark and a one-line promise. Keeps the large-screen
 * onboarding feeling full and confident instead of a shrunken phone.
 */
type BrandPanelProps = {
  animate?: boolean;
  className?: string;
  stepIndex?: number;
};

export function BrandPanel({ animate = true, className = "", stepIndex = 0 }: BrandPanelProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`fa-onb-brand-panel relative flex-col justify-center overflow-hidden p-9 ${className}`}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative graticule is hidden from assistive tech. */}
      <svg
        viewBox="0 0 400 440"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-50"
        fill="none"
        stroke="rgba(255,255,255,.18)"
        strokeWidth="1.4"
        aria-hidden
      >
        <ellipse cx="200" cy="220" rx="230" ry="230" />
        <ellipse cx="200" cy="220" rx="150" ry="230" />
        <line x1="-40" y1="220" x2="440" y2="220" />
        <path d="M-40 150 Q200 190 440 150" />
        <path d="M-40 290 Q200 250 440 290" />
      </svg>
      <div className="relative mb-6 size-40 rounded-full bg-white/92 p-4 shadow-card ring-1 ring-white/35">
        <Orbi tone="dark" expression="sorriso" float={animate} wave={animate} blink={animate} />
      </div>
      <BrandImage asset="wordmark" alt={t("app.name")} className="relative h-9 w-auto invert" />
      <p className="relative mt-5 max-w-[28ch] text-balance text-xl font-black leading-tight text-white">
        {t("onboarding.side.title")}
      </p>
      <p className="relative mt-2 max-w-[30ch] text-sm font-semibold leading-relaxed text-white/88">
        {t("onboarding.brandTagline")}
      </p>
      <ol className="relative mt-9 flex flex-col gap-3 text-sm font-extrabold text-white/88">
        {SIDE_STEPS.map((item) => {
          const isReached = stepIndex >= item.threshold;
          return (
            <li key={item.key} className="flex items-center gap-3">
              <span
                className={`flex size-7 items-center justify-center rounded-full ring-1 ${
                  isReached
                    ? "bg-white text-primary ring-white"
                    : "bg-white/12 text-white/72 ring-white/25"
                }`}
              >
                {isReached ? (
                  <Icon name="check" size={15} strokeWidth={3} />
                ) : (
                  <span className="size-2 rounded-full bg-current" />
                )}
              </span>
              {t(`onboarding.side.${item.key}`)}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
