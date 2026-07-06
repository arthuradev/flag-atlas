import { useTranslation } from "react-i18next";
import { Globi } from "@/shared/components/Globi";
import { Icon } from "@/shared/components/Icon";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

/** Step 2 — a live-looking sample question showing how a round plays. */
export function TrainingStep({ animate = true }: { animate?: boolean }) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${animate ? "fa-onb-in" : ""}`}
    >
      <div className="relative w-full max-w-[280px]">
        <div className="rounded-[22px] border border-line bg-surface p-[18px] shadow-card">
          <div className="mb-2.5 text-left text-xs font-bold text-text-muted">
            {t("onboarding.training.question")}
          </div>
          <div className="mb-3.5 flex h-[88px] items-center justify-center overflow-hidden rounded-xl border border-[#E4EAEC] bg-white">
            <span className="size-11 rounded-full bg-[#FF3B30]" aria-hidden />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl border-[1.5px] border-ring bg-ring/15 px-3.5 py-2.5 text-sm font-bold text-text">
              <span>{t("onboarding.training.answer")}</span>
              <Icon name="check" size={18} strokeWidth={3} className="text-ring" />
            </div>
            <div className="rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-left text-sm font-bold text-text-muted">
              {t("onboarding.training.decoy1")}
            </div>
            <div className="rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-left text-sm font-bold text-text-muted">
              {t("onboarding.training.decoy2")}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-3.5 size-[76px]">
          <Globi variant="compact" expression="alegre" float={animate} />
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-10 text-[28px] font-black leading-[1.1] tracking-tight text-text outline-none lg:text-[34px]"
      >
        {t("onboarding.training.title")}
      </h1>
      <p className="mt-2.5 max-w-[28ch] text-base font-medium leading-relaxed text-text-muted lg:max-w-[34ch] lg:text-lg">
        {t("onboarding.training.body")}
      </p>
    </div>
  );
}
