import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import { VisualEffectBurst } from "@/features/cosmetics/components/VisualEffectBurst";
import { flagFrameClass } from "@/features/cosmetics/logic/flagFrames";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { ExerciseBody } from "@/features/training/components/exercises/ExerciseBody";
import {
  getSurvivalLivesRemaining,
  SURVIVAL_STARTING_LIVES,
} from "@/features/training/logic/survival";
import { type AnswerFeedback, useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Locale } from "@/shared/i18n/locale";
import { hapticError, hapticSuccess, TRAINING_NATIVE_BACK_EVENT } from "@/shared/native/mobile";

const SURVIVAL_LIFE_SLOTS = Array.from(
  { length: SURVIVAL_STARTING_LIVES },
  (_, index) => `survival-life-${index + 1}`,
);

type TrainingTopBarProps = {
  current: number;
  total: number;
  currentStreak: number;
  sessionXp: number;
  isSurvival: boolean;
  livesRemaining: number;
  score: number;
  onExit: () => void;
};

function TrainingTopBar({
  current,
  total,
  currentStreak,
  sessionXp,
  isSurvival,
  livesRemaining,
  score,
  onExit,
}: TrainingTopBarProps) {
  const { t } = useTranslation();
  const safeTotal = Math.max(1, total);
  const visibleCurrent = Math.min(Math.max(0, current), safeTotal);

  return (
    <header className="mobile-safe-top shrink-0 border-b border-line bg-background/95 px-3 py-2 backdrop-blur sm:px-5 sm:py-3">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          type="button"
          aria-label={t("training.exitButtonAria")}
          onClick={onExit}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-btn border border-line bg-surface text-muted shadow-sm transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon name="x" size={21} strokeWidth={2.5} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-extrabold text-text-muted sm:text-sm">
            <span>
              <span className="sr-only">
                {t("training.questionLabel", { current: visibleCurrent, total: safeTotal })}
              </span>
              <span aria-hidden="true">{t("training.questionShort", { current, total })}</span>
            </span>
            <span className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              {isSurvival && (
                <>
                  <span data-testid="survival-lives" className="inline-flex items-center gap-0.5">
                    <span className="sr-only">
                      {t("survival.livesLabel", {
                        lives: livesRemaining,
                        total: SURVIVAL_STARTING_LIVES,
                      })}
                    </span>
                    {SURVIVAL_LIFE_SLOTS.map((slot, index) => (
                      <Icon
                        key={slot}
                        name="heart"
                        size={16}
                        fill={index < livesRemaining ? "currentColor" : "none"}
                        className={index < livesRemaining ? "text-danger" : "text-faint"}
                      />
                    ))}
                  </span>
                  <span data-testid="survival-score" className="inline-flex items-center gap-1">
                    <span className="sr-only">{t("survival.scoreLabel", { score })}</span>
                    <Icon name="trophy" size={16} className="text-warning" />
                    <span aria-hidden="true">{score}</span>
                  </span>
                </>
              )}
              <span className="inline-flex items-center gap-1">
                <span className="sr-only">{t("training.streak", { count: currentStreak })}</span>
                <Icon name="flame" size={16} className="text-danger" />
                <span aria-hidden="true">{currentStreak}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="sr-only">{t("training.sessionXp", { xp: sessionXp })}</span>
                <Icon name="sparkles" size={16} className="text-warning" />
                <span aria-hidden="true">{sessionXp}</span>
              </span>
            </span>
          </div>
          <ProgressBar
            value={Math.max(0, visibleCurrent - 1)}
            max={safeTotal}
            size="thin"
            label={t("training.questionLabel", { current: visibleCurrent, total: safeTotal })}
            colorClassName="bg-primary"
          />
        </div>
      </div>
    </header>
  );
}

type TrainingFeedbackBarProps = {
  feedback: AnswerFeedback | null;
  isTyping: boolean;
  country: Country;
  selectedCountry: Country | undefined;
  locale: Locale;
  onContinue: () => void;
  onSkip: () => void;
};

function FeedbackDetail({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold text-text-muted sm:text-base">{children}</p>;
}

function TrainingFeedbackBar({
  feedback,
  isTyping,
  country,
  selectedCountry,
  locale,
  onContinue,
  onSkip,
}: TrainingFeedbackBarProps) {
  const { t } = useTranslation();
  const countryName = getCountryName(country, locale);

  return (
    <footer
      aria-live="polite"
      className="mobile-safe-bottom shrink-0 border-t border-line bg-background/95 px-3 pt-2 backdrop-blur sm:px-5 sm:pb-3 sm:pt-3"
    >
      <div className="mx-auto max-w-6xl">
        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex flex-col gap-3 rounded-card border-2 bg-surface p-3 shadow-card sm:flex-row sm:items-center sm:gap-4 sm:p-4 ${
              feedback.isCorrect ? "border-success" : "border-danger"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Icon
                  name={feedback.isCorrect ? "check-circle" : "x-circle"}
                  size={22}
                  className={feedback.isCorrect ? "text-success" : "text-danger"}
                />
                <p className="text-lg font-extrabold">
                  {feedback.isSkipped
                    ? t("training.skippedTitle")
                    : feedback.isCorrect
                      ? t("training.correctTitle")
                      : t("training.wrongTitle")}
                </p>
                {feedback.xpGained > 0 && (
                  <span className="rounded-full bg-warning/10 px-2.5 py-1 text-sm font-extrabold text-warning">
                    {t("training.xpGained", { xp: feedback.xpGained })}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-col gap-1">
                {feedback.isCorrect && !feedback.promoted && (
                  <FeedbackDetail>
                    {t("training.correctAnswer", { country: countryName })}
                  </FeedbackDetail>
                )}
                {feedback.isCorrect && isTyping && feedback.promoted && (
                  <p className="font-bold">{countryName}</p>
                )}
                {!feedback.isCorrect && (
                  <>
                    <FeedbackDetail>
                      {t(
                        feedback.isSkipped
                          ? "training.skippedCorrectAnswer"
                          : "training.correctAnswerWas",
                        {
                          country: countryName,
                        },
                      )}
                    </FeedbackDetail>
                    {selectedCountry && !feedback.isSkipped && (
                      <FeedbackDetail>
                        {t("training.youChose", {
                          country: getCountryName(selectedCountry, locale),
                        })}
                      </FeedbackDetail>
                    )}
                    {feedback.typedAnswer !== undefined && (
                      <FeedbackDetail>
                        {t("typing.youTyped", { answer: feedback.typedAnswer })}
                      </FeedbackDetail>
                    )}
                    <p className="text-sm font-semibold text-text-muted">
                      {t(
                        feedback.isSkipped ? "training.skippedReview" : "training.markedForReview",
                      )}
                    </p>
                  </>
                )}
                {feedback.promoted && (
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-success">
                    <span>
                      {t(
                        feedback.masteryAfter === "master"
                          ? "training.platinumUnlocked"
                          : "training.masteryUp",
                        {
                          country: countryName,
                          from: t(`mastery.${feedback.masteryBefore}`),
                          to: t(`mastery.${feedback.masteryAfter}`),
                        },
                      )}
                    </span>
                    <MasteryBadge masteryLevel={feedback.masteryAfter} size="sm" showTier />
                  </div>
                )}
              </div>
            </div>

            <Button size="lg" className="w-full shrink-0 sm:w-auto" onClick={onContinue}>
              {t("common.continue")}
            </Button>
          </motion.div>
        ) : (
          <div className="flex min-h-16 items-center justify-center rounded-card border border-dashed border-line bg-surface/70 px-4 sm:min-h-20">
            <Button variant="secondary" size="md" onClick={onSkip}>
              {t("training.skip")}
            </Button>
          </div>
        )}
      </div>
    </footer>
  );
}

type TrainingExitDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function TrainingExitDialog({ open, onCancel, onConfirm }: TrainingExitDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      return;
    }
    document.getElementById("training-exit-keep")?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="training-exit-title"
        aria-describedby="training-exit-description"
        className="w-full max-w-md rounded-card border border-line bg-surface p-5 shadow-card"
      >
        <h2 id="training-exit-title" className="text-xl font-black text-text">
          {t("training.exitTitle")}
        </h2>
        <p
          id="training-exit-description"
          className="mt-2 text-sm font-semibold text-text-muted sm:text-base"
        >
          {t("training.exitBody")}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button id="training-exit-keep" variant="secondary" onClick={onCancel}>
            {t("training.keepTraining")}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {t("training.leaveTraining")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TrainingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const flagFrameId = useEquippedId("flagFrame");
  const [effectKey, setEffectKey] = useState(0);
  const [isExitDialogOpen, setExitDialogOpen] = useState(false);
  const { session, feedback, sessionXp, currentStreak, summary } = useSessionStore();
  const startSession = useSessionStore((state) => state.startSession);
  const answerCurrentQuestion = useSessionStore((state) => state.answerCurrentQuestion);
  const answerCurrentQuestionTyped = useSessionStore((state) => state.answerCurrentQuestionTyped);
  const skipCurrentQuestion = useSessionStore((state) => state.skipCurrentQuestion);
  const advance = useSessionStore((state) => state.advance);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    if (summary && !session) {
      navigate("/session-result", { replace: true });
    }
  }, [summary, session, navigate]);

  useEffect(() => {
    if (!session && !summary) {
      startSession({ mode: "continue", questionType: "choice", size: defaultSessionSize });
    }
  }, [session, summary, startSession, defaultSessionSize]);

  useEffect(() => {
    if (feedback) {
      playSound(feedback.isCorrect ? "success" : "error");
      void (feedback.isCorrect ? hapticSuccess() : hapticError());
    }
  }, [feedback]);

  useEffect(() => {
    if (feedback?.isCorrect) {
      setEffectKey((key) => key + 1);
    }
  }, [feedback]);

  useEffect(() => {
    if (!session || summary) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session, summary]);

  useEffect(() => {
    const handleNativeBack = () => {
      setExitDialogOpen(true);
    };

    window.addEventListener(TRAINING_NATIVE_BACK_EVENT, handleNativeBack);

    return () => {
      window.removeEventListener(TRAINING_NATIVE_BACK_EVENT, handleNativeBack);
    };
  }, []);

  const handleRequestExit = () => setExitDialogOpen(true);
  const handleCancelExit = () => setExitDialogOpen(false);
  const handleConfirmExit = () => {
    clearSession();
    setExitDialogOpen(false);
    navigate("/home", { replace: true });
  };

  if (!session) {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden bg-background text-text">
        <span className="sr-only">{t("training.title")}</span>
      </div>
    );
  }

  const question = session.questions[session.currentIndex];
  const country = question ? getCountryById(question.countryId) : undefined;
  const isTyping = session.config.questionType === "typing";
  const isSurvival = session.config.mode === "survival";
  const current = session.currentIndex + 1;
  const total = session.questions.length;
  const livesRemaining = getSurvivalLivesRemaining(session);
  const score = session.answers.filter((answer) => answer.isCorrect).length;
  const selectedCountry = feedback?.selectedCountryId
    ? getCountryById(feedback.selectedCountryId)
    : undefined;

  if (!question || !country) {
    return (
      <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-background text-text">
        <TrainingTopBar
          current={0}
          total={total}
          currentStreak={currentStreak}
          sessionXp={sessionXp}
          isSurvival={isSurvival}
          livesRemaining={livesRemaining}
          score={score}
          onExit={handleRequestExit}
        />
        <main className="flex min-h-0 items-center justify-center overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-xl2 bg-pine-soft text-primary">
              <Icon name="map" size={34} />
            </span>
            <p className="text-text-muted">
              {session.config.mode === "review"
                ? t("review.nothingToReview")
                : t("training.emptyPool")}
            </p>
            <Button
              size="lg"
              onClick={() =>
                startSession({ mode: "continue", questionType: "choice", size: defaultSessionSize })
              }
            >
              <Icon name="play" size={20} fill="currentColor" strokeWidth={1.8} />
              {t("home.continueTraining")}
            </Button>
          </div>
        </main>
        <TrainingExitDialog
          open={isExitDialogOpen}
          onCancel={handleCancelExit}
          onConfirm={handleConfirmExit}
        />
      </div>
    );
  }

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-background text-text">
      <TrainingTopBar
        current={current}
        total={total}
        currentStreak={currentStreak}
        sessionXp={sessionXp}
        isSurvival={isSurvival}
        livesRemaining={livesRemaining}
        score={score}
        onExit={handleRequestExit}
      />

      <main className="min-h-0 overflow-y-auto px-3 py-2 sm:px-5 sm:py-3 lg:overflow-hidden">
        <motion.div
          key={session.currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-2 sm:gap-3"
        >
          <h1 className="shrink-0 text-center text-lg font-black sm:text-2xl">
            {t(isTyping ? "typing.prompt" : "training.whichCountry")}
          </h1>

          <div
            className={`relative mx-auto flex h-[clamp(7rem,22dvh,10rem)] w-full max-w-3xl shrink-0 items-center justify-center overflow-hidden rounded-card border border-line bg-surface p-2 shadow-flag sm:h-[clamp(9rem,30dvh,18rem)] sm:p-4 lg:h-[clamp(11rem,34dvh,22rem)] ${flagFrameClass(flagFrameId)}`}
          >
            <FlagImage
              key={question.countryId}
              flagPath={country.flagPath}
              alt={t("training.flagAlt")}
              className="max-h-full max-w-full rounded-lg object-contain shadow-flag"
            />
            <VisualEffectBurst playKey={effectKey} className="rounded-card" />
          </div>

          <ExerciseBody
            question={question}
            questionIndex={session.currentIndex}
            questionType={session.config.questionType}
            feedback={feedback}
            locale={locale}
            onSelectOption={answerCurrentQuestion}
            onSubmitTyped={answerCurrentQuestionTyped}
          />
        </motion.div>
      </main>

      <TrainingFeedbackBar
        feedback={feedback}
        isTyping={isTyping}
        country={country}
        selectedCountry={selectedCountry}
        locale={locale}
        onContinue={advance}
        onSkip={skipCurrentQuestion}
      />

      <TrainingExitDialog
        open={isExitDialogOpen}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
