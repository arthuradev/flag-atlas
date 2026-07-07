import { useTranslation } from "react-i18next";
import { Icon, type IconName } from "@/shared/components/Icon";
import type { OnboardingStartMode } from "@/shared/storage/onboardingRepository";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

const START_MODE_OPTIONS = [
  { mode: "new", icon: "sprout" },
  { mode: "some", icon: "layers" },
  { mode: "review", icon: "refresh" },
] satisfies readonly { icon: IconName; mode: OnboardingStartMode }[];

type StartModeStepProps = {
  selectedMode: OnboardingStartMode | null;
  onSelect: (mode: OnboardingStartMode) => void;
  animate?: boolean;
};

export function StartModeStep({ selectedMode, onSelect, animate = true }: StartModeStepProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className={`flex flex-col gap-5 ${animate ? "fa-onb-in" : ""}`}>
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] font-black leading-[1.1] text-text outline-none lg:text-[36px]"
        >
          {t("onboarding.start.title")}
        </h1>
        <p className="mt-2 max-w-[34ch] text-base font-semibold leading-relaxed text-text-muted">
          {t("onboarding.start.body")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {START_MODE_OPTIONS.map((option) => {
          const isSelected = selectedMode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.mode)}
              className={`flex min-h-32 flex-col items-start gap-3 rounded-card border-2 bg-surface p-4 text-left shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "border-ring bg-pine-soft text-text"
                  : "border-line hover:-translate-y-0.5 hover:bg-surface-2"
              }`}
            >
              <span
                className={`flex size-10 items-center justify-center rounded-btn ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-pine-soft text-primary"
                }`}
                aria-hidden
              >
                <Icon name={option.icon} size={20} />
              </span>
              <span className="text-base font-black leading-tight">
                {t(`onboarding.start.options.${option.mode}.title`)}
              </span>
              <span className="text-sm font-semibold leading-snug text-text-muted">
                {t(`onboarding.start.options.${option.mode}.body`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
