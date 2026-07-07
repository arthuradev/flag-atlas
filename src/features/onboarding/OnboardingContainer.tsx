import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { AnimatedSplash } from "./components/AnimatedSplash";
import { OnboardingLayout } from "./components/OnboardingLayout";
import {
  evaluateLessonZeroAnswer,
  getLessonZeroCountries,
  type LessonZeroOutcome,
  skipLessonZero,
} from "./logic/lessonZero";
import { DailyGoalStep } from "./steps/DailyGoalStep";
import { LessonFeedbackStep } from "./steps/LessonFeedbackStep";
import { LessonZeroStep } from "./steps/LessonZeroStep";
import { ProfileStep } from "./steps/ProfileStep";
import { RewardStep } from "./steps/RewardStep";
import { StartModeStep } from "./steps/StartModeStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { useOnboardingStore } from "./store/onboardingStore";

type Phase =
  | "splash"
  | "welcome"
  | "start"
  | "goal"
  | "lesson"
  | "feedback"
  | "reward"
  | "profile"
  | "complete";

const STEP_ORDER = ["welcome", "start", "goal", "lesson", "reward", "profile"] as const;

function resolveInitialPhase(state: ReturnType<typeof useOnboardingStore.getState>): Phase {
  if (state.hasCompletedOnboarding) {
    return "complete";
  }
  if (!state.hasSeenSplash) {
    return "splash";
  }
  if (!state.hasCompletedIntro) {
    return "welcome";
  }
  if (!state.selectedStartMode) {
    return "start";
  }
  if (!state.dailyGoal) {
    return "goal";
  }
  if (!state.hasCompletedLessonZero) {
    return "lesson";
  }
  if (!state.hasSeenFirstReward) {
    return "reward";
  }
  return "profile";
}

function getStepIndex(phase: Phase): number {
  if (phase === "feedback") {
    return STEP_ORDER.indexOf("lesson");
  }
  const index = STEP_ORDER.indexOf(phase as (typeof STEP_ORDER)[number]);
  return Math.max(0, index);
}

export function OnboardingContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const progress = useProgressStore((state) => state.progress);
  const registerAnswer = useProgressStore((state) => state.registerAnswer);
  const registerCompletedSession = useProgressStore((state) => state.registerCompletedSession);
  const onboarding = useOnboardingStore();

  const [phase, setPhase] = useState<Phase>(() => resolveInitialPhase(onboarding));
  const [selectedLessonCountryId, setSelectedLessonCountryId] = useState<string | null>(null);
  const [lessonOutcome, setLessonOutcome] = useState<LessonZeroOutcome | null>(null);
  const [lessonCoinsEarned, setLessonCoinsEarned] = useState(0);
  const [profileName, setProfileName] = useState(onboarding.profileName);

  const animate = !reduceMotion;
  const lessonCountries = useMemo(() => getLessonZeroCountries(), []);

  useEffect(() => {
    if (phase === "complete" || onboarding.hasCompletedOnboarding) {
      navigate("/home", { replace: true });
    }
  }, [onboarding.hasCompletedOnboarding, navigate, phase]);

  const handleSplashDone = useCallback(() => {
    onboarding.markSplashSeen();
    setPhase("welcome");
  }, [onboarding]);

  const handleVerifyLesson = () => {
    if (!selectedLessonCountryId) {
      return;
    }
    const outcome = evaluateLessonZeroAnswer(
      selectedLessonCountryId,
      progress.countries.br,
      new Date().toISOString(),
    );
    setLessonOutcome(outcome);
    setPhase("feedback");
  };

  const handleSkipLesson = () => {
    const outcome = skipLessonZero(progress.countries.br, new Date().toISOString());
    setLessonOutcome(outcome);
    setPhase("feedback");
  };

  const handleFinishLesson = () => {
    if (!lessonOutcome) {
      return;
    }
    const coinsBefore = useProgressStore.getState().progress.cosmetics.coins;
    if (!lessonOutcome.wasSkipped) {
      registerAnswer(
        lessonOutcome.countryProgress,
        lessonOutcome.xpGained,
        lessonOutcome.answeredAt,
      );
    }
    registerCompletedSession({
      mode: "continue",
      questionType: "choice",
      questionCount: 1,
      correctCount: lessonOutcome.isCorrect ? 1 : 0,
      accuracy: lessonOutcome.accuracy,
      bestStreak: lessonOutcome.isCorrect ? 1 : 0,
    });
    const coinsAfter = useProgressStore.getState().progress.cosmetics.coins;
    setLessonCoinsEarned(Math.max(0, coinsAfter - coinsBefore));
    onboarding.completeLessonZero();
    setPhase("reward");
  };

  const handleCreateProfile = () => {
    onboarding.completeOnboarding(profileName);
    navigate("/home", { replace: true });
  };

  const handleSkipProfile = () => {
    onboarding.completeOnboarding("");
    navigate("/home", { replace: true });
  };

  if (phase === "splash") {
    return <AnimatedSplash reduceMotion={reduceMotion} onDone={handleSplashDone} />;
  }

  const primary =
    phase === "profile" || phase === "complete"
      ? undefined
      : {
          label:
            phase === "lesson"
              ? t("onboarding.lesson.verify")
              : phase === "feedback"
                ? t("common.continue")
                : t("common.continue"),
          onClick:
            phase === "welcome"
              ? () => {
                  onboarding.completeIntro();
                  setPhase("start");
                }
              : phase === "start"
                ? () => setPhase("goal")
                : phase === "goal"
                  ? () => setPhase("lesson")
                  : phase === "lesson"
                    ? handleVerifyLesson
                    : phase === "feedback"
                      ? handleFinishLesson
                      : () => {
                          onboarding.markFirstRewardSeen();
                          setPhase("profile");
                        },
          disabled:
            (phase === "start" && !onboarding.selectedStartMode) ||
            (phase === "goal" && !onboarding.dailyGoal) ||
            (phase === "lesson" && !selectedLessonCountryId),
          icon: phase === "lesson" ? ("check" as const) : ("arrow" as const),
        };
  const secondary =
    phase === "lesson"
      ? {
          label: t("onboarding.skip"),
          onClick: handleSkipLesson,
          icon: "x" as const,
        }
      : undefined;

  return (
    <OnboardingLayout
      stepIndex={getStepIndex(phase)}
      stepCount={STEP_ORDER.length}
      animate={animate}
      primary={primary}
      secondary={secondary}
    >
      {phase === "welcome" && <WelcomeStep animate={animate} />}
      {phase === "start" && (
        <StartModeStep
          selectedMode={onboarding.selectedStartMode}
          onSelect={onboarding.selectStartMode}
          animate={animate}
        />
      )}
      {phase === "goal" && (
        <DailyGoalStep
          selectedGoal={onboarding.dailyGoal}
          onSelect={onboarding.setDailyGoal}
          animate={animate}
        />
      )}
      {phase === "lesson" && (
        <LessonZeroStep
          countries={lessonCountries}
          selectedCountryId={selectedLessonCountryId}
          onSelect={setSelectedLessonCountryId}
          animate={animate}
        />
      )}
      {phase === "feedback" && lessonOutcome && (
        <LessonFeedbackStep outcome={lessonOutcome} animate={animate} />
      )}
      {phase === "reward" && (
        <RewardStep
          outcome={lessonOutcome}
          dailyGoal={onboarding.dailyGoal}
          coinsEarned={lessonCoinsEarned}
          animate={animate}
        />
      )}
      {phase === "profile" && (
        <ProfileStep
          name={profileName}
          onNameChange={setProfileName}
          onBegin={handleCreateProfile}
          onSkip={handleSkipProfile}
          animate={animate}
        />
      )}
    </OnboardingLayout>
  );
}
