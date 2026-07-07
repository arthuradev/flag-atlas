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
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${
        animate ? "fa-onb-in" : ""
      }`}
    >
      <div className="mb-4 size-24 rounded-full bg-pine-soft p-2 ring-1 ring-ring/30 lg:hidden">
        <Globi variant="compact" expression="piscada" blink={animate} float={animate} />
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px] font-black leading-[1.1] text-text outline-none lg:text-[36px]"
      >
        {t("onboarding.profile.title")}
      </h1>
      <p className="mt-3 max-w-[34ch] text-base font-semibold leading-relaxed text-text-muted lg:text-lg">
        {t("onboarding.profile.body")}
      </p>

      <div className="mt-6 flex w-full max-w-[360px] flex-col gap-3.5">
        <div>
          <label
            htmlFor="onboarding-name"
            className="mb-1.5 block text-left text-xs font-black uppercase text-text-muted"
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
            className="w-full rounded-btn border-[1.5px] border-line bg-surface px-4 py-3.5 text-base font-bold text-text outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25"
          />
        </div>

        <Button type="submit" size="lg" fullWidth>
          {t("onboarding.profile.create")}
        </Button>
        <Button type="button" variant="ghost" size="lg" fullWidth onClick={onSkip}>
          {t("onboarding.profile.skip")}
        </Button>
      </div>
    </form>
  );
}
