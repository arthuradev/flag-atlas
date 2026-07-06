import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { AnimatedSplash } from "./components/AnimatedSplash";
import { OnboardingLayout } from "./components/OnboardingLayout";
import { ProfileStep } from "./steps/ProfileStep";
import { ProgressStep } from "./steps/ProgressStep";
import { TrainingStep } from "./steps/TrainingStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { useOnboardingStore } from "./store/onboardingStore";

type Phase = "splash" | "welcome" | "training" | "progress" | "profile";

const STEP_ORDER = ["welcome", "training", "progress", "profile"] as const;

const CTA_KEYS: Record<(typeof STEP_ORDER)[number], string> = {
  welcome: "onboarding.cta.welcome",
  training: "onboarding.cta.training",
  progress: "onboarding.cta.progress",
  profile: "onboarding.profile.begin",
};

/**
 * Drives the first-run experience as a small state machine:
 * splash -> welcome -> training -> progress -> profile -> home. Only the
 * "completed" flag (plus the chosen name) is persisted; returning users never
 * see this again (see router `RootRedirect`).
 */
export function OnboardingContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const animate = !reduceMotion;

  const [phase, setPhase] = useState<Phase>("splash");
  const [name, setName] = useState("");

  const stepIndex = STEP_ORDER.indexOf(phase as (typeof STEP_ORDER)[number]);

  const goNext = () => {
    if (stepIndex < 0) {
      return;
    }
    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      setPhase(next);
    }
  };

  const skip = () => setPhase("profile");

  const begin = () => {
    completeOnboarding(name.trim());
    navigate("/home", { replace: true });
  };

  if (phase === "splash") {
    return <AnimatedSplash reduceMotion={reduceMotion} onDone={() => setPhase("welcome")} />;
  }

  const isProfile = phase === "profile";

  return (
    <OnboardingLayout
      stepIndex={stepIndex}
      stepCount={STEP_ORDER.length}
      animate={animate}
      onSkip={isProfile ? undefined : skip}
      primary={
        isProfile
          ? undefined
          : { label: t(CTA_KEYS[phase as (typeof STEP_ORDER)[number]]), onClick: goNext }
      }
    >
      <div key={phase}>
        {phase === "welcome" && <WelcomeStep animate={animate} />}
        {phase === "training" && <TrainingStep animate={animate} />}
        {phase === "progress" && <ProgressStep animate={animate} />}
        {phase === "profile" && (
          <ProfileStep name={name} onNameChange={setName} onBegin={begin} animate={animate} />
        )}
      </div>
    </OnboardingLayout>
  );
}
