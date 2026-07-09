import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrandImage } from "@/shared/brand/BrandImage";
import { FlaggoLogo } from "@/shared/brand/FlaggoLogo";

type AnimatedSplashProps = {
  onDone: () => void;
  reduceMotion?: boolean;
};

/** Short branded handoff from the native splash into the first-run journey. */
export function AnimatedSplash({ onDone, reduceMotion = false }: AnimatedSplashProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduceMotion ? 700 : 1250);
    return () => window.clearTimeout(timer);
  }, [onDone, reduceMotion]);

  return (
    <button
      type="button"
      aria-label={t("onboarding.splash.skip")}
      onClick={onDone}
      className="fa-onb-splash fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden"
    >
      <div className="fa-onb-splash-glow absolute left-1/2 top-[-8%] h-[56%] w-[130%] -translate-x-1/2" />
      {!reduceMotion &&
        ["one", "two", "three", "four"].map((star) => (
          <span
            key={star}
            className={`fa-onb-twinkle fa-onb-splash-star-${star} absolute size-[3px] rounded-full bg-sidebar-fg`}
          />
        ))}

      <div className={`relative ${reduceMotion ? "" : "fa-onb-pop"}`}>
        <div className="flex size-36 items-center justify-center rounded-full bg-white/92 p-6 shadow-card ring-1 ring-white/40 sm:size-40">
          <BrandImage asset="symbol" decorative className="size-full" />
        </div>
        <svg
          className={
            reduceMotion
              ? "absolute -right-1.5 -top-1.5"
              : "fa-onb-spark absolute -right-1.5 -top-1.5"
          }
          width="40"
          height="40"
          viewBox="0 0 40 40"
          aria-hidden={true}
        >
          <path d="M20 3 L23 16 L36 20 L23 24 L20 37 L17 24 L4 20 L17 16 Z" fill="currentColor" />
        </svg>
      </div>

      <div className={`text-center ${reduceMotion ? "" : "fa-onb-word"}`}>
        <FlaggoLogo size={40} className="mx-auto text-sidebar-fg" />
        <p className="mt-3 text-base font-extrabold text-sidebar-fg">
          {t("onboarding.splash.tagline")}
        </p>
      </div>
    </button>
  );
}
