import { useTranslation } from "react-i18next";
import { Orbi } from "@/shared/brand/Orbi";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

export function WelcomeStep({ animate = true }: { animate?: boolean }) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${
        animate ? "fa-onb-in" : ""
      }`}
    >
      <div className="relative flex size-[210px] items-center justify-center lg:hidden">
        {animate && (
          <span className="fa-onb-ring absolute size-[150px] rounded-full border-2 border-ring" />
        )}
        <div className="size-[190px] rounded-full bg-surface/92 p-3 shadow-card ring-1 ring-line">
          <Orbi expression="sorriso" float={animate} wave={animate} blink={animate} ground />
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3.5 text-[29px] font-black leading-[1.1] text-text outline-none lg:mt-0 lg:text-[38px]"
      >
        {t("onboarding.welcome.title")}
      </h1>
      <p className="mt-3 max-w-[28ch] text-[17px] font-semibold leading-relaxed text-text-muted lg:max-w-[34ch] lg:text-lg">
        {t("onboarding.welcome.body")}
      </p>
    </div>
  );
}
