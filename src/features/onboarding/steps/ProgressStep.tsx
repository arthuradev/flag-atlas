import { useTranslation } from "react-i18next";
import { Globi } from "@/shared/components/Globi";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type SampleContinent = { key: string; color: string; percent: number; count: string };

const SAMPLE_CONTINENTS: SampleContinent[] = [
  { key: "onboarding.progress.southAmerica", color: "#2FB98A", percent: 70, count: "8/12" },
  { key: "onboarding.progress.europe", color: "#17B4C9", percent: 24, count: "11/44" },
  { key: "onboarding.progress.africa", color: "#FF6F61", percent: 9, count: "5/54" },
];

/** Step 3 — a peek at XP, levels and per-continent mastery. */
export function ProgressStep({ animate = true }: { animate?: boolean }) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${animate ? "fa-onb-in" : ""}`}
    >
      <div className="flex w-full max-w-[290px] flex-col gap-2.5">
        <div className="flex items-center gap-3 rounded-[18px] border border-line bg-surface p-4 shadow-card">
          <div className="size-[52px] flex-none">
            <Globi variant="compact" flag={false} float={animate} />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-black text-text">
                {t("onboarding.progress.level", { level: 3 })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-ocre-ink">
                <span className="size-3 rounded-full bg-[#FFC53D]" aria-hidden />
                {t("onboarding.progress.xp", { xp: 640 })}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-ring" style={{ width: "64%" }} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-surface p-4">
          {SAMPLE_CONTINENTS.map((continent) => (
            <div key={continent.key} className="flex items-center gap-2.5">
              <span className="w-[104px] text-left text-xs font-bold text-text">
                {t(continent.key)}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${continent.percent}%`, backgroundColor: continent.color }}
                />
              </div>
              <span className="text-[11px] font-bold text-text-muted">{continent.count}</span>
            </div>
          ))}
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-7 text-[28px] font-black leading-[1.1] tracking-tight text-text outline-none lg:text-[34px]"
      >
        {t("onboarding.progress.title")}
      </h1>
      <p className="mt-2.5 max-w-[28ch] text-base font-medium leading-relaxed text-text-muted lg:max-w-[34ch] lg:text-lg">
        {t("onboarding.progress.body")}
      </p>
    </div>
  );
}
