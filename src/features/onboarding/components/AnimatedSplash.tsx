import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globi } from "@/shared/components/Globi";

/**
 * The branded opening splash: Globi pops in over a starry navy sky, a gold
 * spark twinkles, and the wordmark rises. It holds briefly then hands off to
 * the welcome step; a tap (or Enter/Space) skips ahead. Native OS splash still
 * covers cold start on Capacitor — this is the in-app second layer.
 */
type AnimatedSplashProps = {
  onDone: () => void;
  reduceMotion?: boolean;
};

export function AnimatedSplash({ onDone, reduceMotion = false }: AnimatedSplashProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduceMotion ? 1000 : 1750);
    return () => window.clearTimeout(timer);
  }, [onDone, reduceMotion]);

  return (
    <button
      type="button"
      aria-label={t("onboarding.splash.skip")}
      onClick={onDone}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden"
      style={{ background: "linear-gradient(180deg,#0B1E27,#123040)" }}
    >
      <div
        className="absolute left-1/2 top-[-8%] h-[56%] w-[130%] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse at center, rgba(23,180,201,.28), transparent 70%)",
        }}
      />
      {!reduceMotion &&
        [
          { top: "20%", left: "22%", delay: "0s" },
          { top: "16%", left: "74%", delay: "0.6s" },
          { top: "66%", left: "30%", delay: "1s" },
          { top: "70%", left: "70%", delay: "0.3s" },
        ].map((star) => (
          <span
            key={`${star.top}-${star.left}`}
            className="fa-onb-twinkle absolute size-[3px] rounded-full bg-[#EAF6F8]"
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}

      <div className={`relative ${reduceMotion ? "" : "fa-onb-pop"}`}>
        <div className="size-40">
          <Globi tone="dark" expression="alegre" wave={!reduceMotion} blink={!reduceMotion} />
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
          <path d="M20 3 L23 16 L36 20 L23 24 L20 37 L17 24 L4 20 L17 16 Z" fill="#FFC53D" />
        </svg>
      </div>

      <div
        className={`text-[38px] font-black leading-none tracking-tight ${reduceMotion ? "" : "fa-onb-word"}`}
      >
        <span style={{ color: "#3FD0E0" }}>Flag</span>{" "}
        <span style={{ color: "#EAF6F8" }}>Atlas</span>
      </div>
    </button>
  );
}
