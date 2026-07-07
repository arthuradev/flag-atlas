import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/Button";
import { Globi } from "@/shared/components/Globi";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type ProfileStepProps = {
  name: string;
  onNameChange: (name: string) => void;
  onBegin: () => void;
  onSkip: () => void;
  animate?: boolean;
};

export function ProfileStep({
  name,
  onNameChange,
  onBegin,
  onSkip,
  animate = true,
}: ProfileStepProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onBegin();
      }}
      className={`mx-auto w-full max-w-[440px] ${animate ? "fa-onb-in" : ""}`}
    >
      <div className="rounded-[24px] border border-line bg-surface p-5 text-center shadow-card sm:p-7">
        <div className="mx-auto -mt-12 mb-3 size-24 rounded-full bg-pine-soft p-2 shadow-card ring-1 ring-ring/30">
          <Globi variant="compact" expression="piscada" blink={animate} float={animate} />
        </div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] font-black leading-[1.1] text-text outline-none lg:text-[36px]"
        >
          {t("onboarding.profile.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[34ch] text-sm font-semibold leading-relaxed text-text-muted sm:text-base">
          {t("onboarding.profile.body")}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3.5">
          <div>
            <label
              htmlFor="onboarding-name"
              className="mb-1.5 block text-left text-xs font-black uppercase tracking-[0.04em] text-text-muted"
            >
              {t("onboarding.profile.nameLabel")}
            </label>
            <input
              id="onboarding-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t("onboarding.profile.namePlaceholder")}
              maxLength={20}
              autoComplete="nickname"
              className="w-full rounded-btn border-2 border-line bg-surface-raised px-4 py-3.5 text-base font-bold text-text outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25"
            />
          </div>

          <Button type="submit" size="lg" fullWidth className="uppercase tracking-[0.04em]">
            {t("onboarding.profile.create")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onSkip}
            className="border border-line bg-transparent uppercase tracking-[0.04em] text-text-muted"
          >
            {t("onboarding.profile.skip")}
          </Button>
        </div>
      </div>
    </form>
  );
}
