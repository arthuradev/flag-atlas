import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { VisualEffectBurst } from "@/features/cosmetics/components/VisualEffectBurst";
import { flagFrameClass } from "@/features/cosmetics/logic/flagFrames";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { OptionButton } from "@/features/training/components/OptionButton";
import { TypedAnswerForm } from "@/features/training/components/TypedAnswerForm";
import {
  getSurvivalLivesRemaining,
  SURVIVAL_STARTING_LIVES,
} from "@/features/training/logic/survival";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { PageShell } from "@/shared/components/PageShell";
import { ProgressBar } from "@/shared/components/ProgressBar";

const ADVANCE_DELAY_CORRECT_MS = 1200;
const ADVANCE_DELAY_WRONG_MS = 2000;
const SURVIVAL_LIFE_SLOTS = Array.from(
  { length: SURVIVAL_STARTING_LIVES },
  (_, index) => `survival-life-${index + 1}`,
);

export function TrainingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const flagFrameId = useEquippedId("flagFrame");
  const [effectKey, setEffectKey] = useState(0);
  const { session, feedback, sessionXp, currentStreak, summary } = useSessionStore();
  const startSession = useSessionStore((state) => state.startSession);
  const answerCurrentQuestion = useSessionStore((state) => state.answerCurrentQuestion);
  const answerCurrentQuestionTyped = useSessionStore((state) => state.answerCurrentQuestionTyped);
  const advance = useSessionStore((state) => state.advance);

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
    if (!feedback) {
      return;
    }
    const timer = setTimeout(
      advance,
      feedback.isCorrect ? ADVANCE_DELAY_CORRECT_MS : ADVANCE_DELAY_WRONG_MS,
    );
    return () => clearTimeout(timer);
  }, [feedback, advance]);

  useEffect(() => {
    if (feedback) {
      playSound(feedback.isCorrect ? "success" : "error");
    }
  }, [feedback]);

  useEffect(() => {
    if (feedback?.isCorrect) {
      setEffectKey((key) => key + 1);
    }
  }, [feedback]);

  if (!session) {
    return (
      <PageShell title={t("training.title")} backTo="/home" width="wide">
        <span className="sr-only">{t("training.title")}</span>
      </PageShell>
    );
  }

  const question = session.questions[session.currentIndex];
  const country = question ? getCountryById(question.countryId) : undefined;
  if (!question || !country) {
    return (
      <PageShell title={t("training.title")} backTo="/home" width="wide">
        <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 text-center">
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
      </PageShell>
    );
  }

  const isTyping = session.config.questionType === "typing";
  const isSurvival = session.config.mode === "survival";
  const current = session.currentIndex + 1;
  const total = session.questions.length;
  const livesRemaining = getSurvivalLivesRemaining(session);
  const score = session.answers.filter((answer) => answer.isCorrect).length;
  const selectedCountry = feedback?.selectedCountryId
    ? getCountryById(feedback.selectedCountryId)
    : undefined;

  return (
    <PageShell
      backTo="/home"
      title={t(isSurvival ? "survival.title" : "training.title")}
      width="wide"
    >
      <div className="flex flex-1 flex-col gap-4 sm:gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-extrabold text-text-muted sm:text-base">
          {isSurvival ? (
            <span data-testid="survival-lives" className="inline-flex items-center gap-1">
              <span className="sr-only">
                {t("survival.livesLabel", {
                  lives: livesRemaining,
                  total: SURVIVAL_STARTING_LIVES,
                })}
              </span>
              <span aria-hidden="true" className="sr-only">
                {"❤️".repeat(livesRemaining)}
                {"🖤".repeat(SURVIVAL_STARTING_LIVES - livesRemaining)}
              </span>
              {SURVIVAL_LIFE_SLOTS.map((slot, index) => (
                <Icon
                  key={slot}
                  name="heart"
                  size={18}
                  fill={index < livesRemaining ? "currentColor" : "none"}
                  className={index < livesRemaining ? "text-danger" : "text-faint"}
                />
              ))}
            </span>
          ) : (
            <span>
              <span className="sr-only">{t("training.questionLabel", { current, total })}</span>
              <span aria-hidden="true">{t("training.questionShort", { current, total })}</span>
            </span>
          )}
          <span className="flex items-center gap-3">
            {isSurvival && (
              <span data-testid="survival-score" className="inline-flex items-center gap-1">
                <span className="sr-only">{t("survival.scoreLabel", { score })}</span>
                <Icon name="trophy" size={17} className="text-warning" />
                <span aria-hidden="true">{score}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <span className="sr-only">{t("training.streak", { count: currentStreak })}</span>
              <Icon name="flame" size={17} className="text-danger" />
              <span aria-hidden="true">{currentStreak}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="sr-only">{t("training.sessionXp", { xp: sessionXp })}</span>
              <Icon name="sparkles" size={17} className="text-warning" />
              <span aria-hidden="true">{sessionXp}</span>
            </span>
          </span>
        </div>
        {!isSurvival && (
          <ProgressBar
            value={current - 1}
            max={total}
            size="thin"
            label={t("training.questionLabel", { current, total })}
            colorClassName="bg-primary"
          />
        )}

        <h2 className="text-center text-xl font-black sm:text-2xl">
          {t(isTyping ? "typing.prompt" : "training.whichCountry")}
        </h2>

        <motion.div
          key={session.currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:gap-6"
        >
          <Card
            className={`relative mx-auto flex h-52 w-full max-w-3xl items-center justify-center bg-surface p-4 shadow-flag sm:h-72 sm:p-6 lg:h-[29rem] ${flagFrameClass(flagFrameId)}`}
          >
            <FlagImage
              key={question.countryId}
              flagPath={country.flagPath}
              alt={t("training.flagAlt")}
              className="max-h-full max-w-full rounded-lg object-contain shadow-flag"
            />
            <VisualEffectBurst playKey={effectKey} className="rounded-card" />
          </Card>

          {isTyping ? (
            <TypedAnswerForm
              key={session.currentIndex}
              disabled={feedback !== null}
              onSubmit={answerCurrentQuestionTyped}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {(question.optionCountryIds ?? []).map((optionId) => {
                const option = getCountryById(optionId);
                if (!option) {
                  return null;
                }
                const state = !feedback
                  ? "idle"
                  : optionId === feedback.correctCountryId
                    ? "correct"
                    : optionId === feedback.selectedCountryId
                      ? "wrong"
                      : "dimmed";
                return (
                  <OptionButton
                    key={optionId}
                    label={getCountryName(option, locale)}
                    state={state}
                    disabled={feedback !== null}
                    onSelect={() => answerCurrentQuestion(optionId)}
                  />
                );
              })}
            </div>
          )}
        </motion.div>

        <div aria-live="polite" className="min-h-28">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mx-auto w-full max-w-3xl"
            >
              <Card
                className={`flex flex-col gap-1 border-2 p-4 ${
                  feedback.isCorrect ? "border-success" : "border-danger"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-extrabold">
                    {feedback.isCorrect ? t("training.correctTitle") : t("training.wrongTitle")}
                  </p>
                  {feedback.xpGained > 0 && (
                    <span className="font-bold text-warning">
                      {t("training.xpGained", { xp: feedback.xpGained })}
                    </span>
                  )}
                </div>
                {feedback.isCorrect && isTyping && (
                  <p className="font-bold">{getCountryName(country, locale)}</p>
                )}
                {!feedback.isCorrect && (
                  <>
                    <p className="text-text-muted">
                      {t("training.correctAnswerWas", { country: getCountryName(country, locale) })}
                    </p>
                    {selectedCountry && (
                      <p className="text-text-muted">
                        {t("training.youChose", {
                          country: getCountryName(selectedCountry, locale),
                        })}
                      </p>
                    )}
                    {feedback.typedAnswer !== undefined && (
                      <p className="text-text-muted">
                        {t("typing.youTyped", { answer: feedback.typedAnswer })}
                      </p>
                    )}
                    <p className="text-sm text-text-muted">{t("training.markedForReview")}</p>
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
                          country: getCountryName(country, locale),
                          from: t(`mastery.${feedback.masteryBefore}`),
                          to: t(`mastery.${feedback.masteryAfter}`),
                        },
                      )}
                    </span>
                    <MasteryBadge masteryLevel={feedback.masteryAfter} size="sm" showTier />
                  </div>
                )}
                <Button variant="ghost" size="md" className="self-end" onClick={advance}>
                  {t("common.continue")}
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
