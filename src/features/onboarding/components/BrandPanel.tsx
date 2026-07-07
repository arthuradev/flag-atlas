import { useTranslation } from "react-i18next";
import { BrandImage } from "@/shared/components/BrandImage";
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
      <div className="relative mb-5 size-40 rounded-full bg-white/92 p-4 shadow-card ring-1 ring-white/35">
        <Globi tone="dark" expression="sorriso" float={animate} wave={animate} blink={animate} />
      </div>
      <BrandImage asset="wordmark" alt={t("app.name")} className="relative h-9 w-auto invert" />
      <p className="relative mt-5 max-w-[28ch] text-balance text-xl font-black leading-tight text-white">
        {t("onboarding.side.title")}
      </p>
      <p className="relative mt-2 max-w-[30ch] text-sm font-semibold leading-relaxed text-white/88">
        {t("onboarding.brandTagline")}
      </p>
      <ol className="relative mt-8 flex flex-col gap-3 text-sm font-extrabold text-white/88">
        {["start", "goal", "lesson"].map((item) => (
          <li key={item} className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/25">
              <span className="size-2 rounded-full bg-white" />
            </span>
            {t(`onboarding.side.${item}`)}
          </li>
        ))}
      </ol>
    </div>
  );
}
