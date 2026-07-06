import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { BrandImage } from "@/shared/components/BrandImage";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Icon, type IconName } from "@/shared/components/Icon";

type OnboardingStep =
  | { brand: true; titleKey: string; bodyKey: string }
  | { icon: IconName; titleKey: string; bodyKey: string };

const FIRST_STEP = {
  brand: true,
  titleKey: "onboarding.welcomeTitle",
  bodyKey: "onboarding.welcomeBody",
} satisfies OnboardingStep;

const STEPS = [
  FIRST_STEP,
  { icon: "map", titleKey: "onboarding.worldTitle", bodyKey: "onboarding.worldBody" },
  { icon: "sprout", titleKey: "onboarding.paceTitle", bodyKey: "onboarding.paceBody" },
] as const satisfies readonly OnboardingStep[];

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex] ?? FIRST_STEP;
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      navigate("/home", { replace: true });
      return;
    }
    setStepIndex((index) => index + 1);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-8">
      <Card className="flex flex-col items-center gap-4 text-center">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF6F8] p-1 text-primary ring-1 ring-primary/15">
            {"brand" in step ? (
              <BrandImage asset="globi" decorative className="h-16 w-16" />
            ) : (
              <Icon name={step.icon} size={44} strokeWidth={1.8} />
            )}
          </span>
          <h1 className="text-2xl font-extrabold">{t(step.titleKey)}</h1>
          <p className="text-lg text-text-muted">{t(step.bodyKey)}</p>
        </motion.div>

        <div
          className="flex gap-2 py-2"
          role="status"
          aria-label={t("onboarding.stepLabel", { current: stepIndex + 1, total: STEPS.length })}
        >
          {STEPS.map((item, index) => (
            <span
              key={item.titleKey}
              aria-hidden="true"
              className={`size-2.5 rounded-full transition-colors ${
                index === stepIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <Button size="lg" fullWidth onClick={handleNext}>
          {isLastStep ? t("onboarding.start") : t("onboarding.next")}
        </Button>
      </Card>
    </div>
  );
}
