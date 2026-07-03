import { motion } from "motion/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { OptionButton } from "@/features/training/components/OptionButton";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { PageShell } from "@/shared/components/PageShell";
import { ProgressBar } from "@/shared/components/ProgressBar";

const ADVANCE_DELAY_CORRECT_MS = 1200;
const ADVANCE_DELAY_WRONG_MS = 2000;

export function TrainingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const { session, feedback, sessionXp, currentStreak, summary } = useSessionStore();
  const startSession = useSessionStore((state) => state.startSession);
  const answerCurrentQuestion = useSessionStore((state) => state.answerCurrentQuestion);
  const advance = useSessionStore((state) => state.advance);

  // Sessão terminou nesta tela: mostra o resumo.
  useEffect(() => {
    if (summary && !session) {
      navigate("/session-result", { replace: true });
    }
  }, [summary, session, navigate]);

  // Entrada direta pelo CTA "Continuar treino": inicia sessão padrão.
  useEffect(() => {
    if (!session && !summary) {
      startSession({ mode: "continue", size: defaultSessionSize });
    }
  }, [session, summary, startSession, defaultSessionSize]);

  // Avanço automático após o feedback (mais tempo para aprender com o erro).
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

  // Som de acerto/erro, respeitando as configurações.
  useEffect(() => {
    if (feedback) {
      playSound(feedback.isCorrect ? "success" : "error");
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
        <p className="py-10 text-center text-text-muted">{t("training.emptyPool")}</p>
      </PageShell>
    );
  }

  const current = session.currentIndex + 1;
  const total = session.questions.length;
  const selectedCountry = feedback ? getCountryById(feedback.selectedCountryId) : undefined;

  return (
    <PageShell backTo="/home" title={t("training.title")} width="wide">
      <div className="flex flex-1 flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between text-sm font-bold text-text-muted sm:text-base">
          <span>
            <span className="sr-only">{t("training.questionLabel", { current, total })}</span>
            <span aria-hidden="true">{t("training.questionShort", { current, total })}</span>
          </span>
          <span className="flex items-center gap-3">
            <span>
              <span className="sr-only">{t("training.streak", { count: currentStreak })}</span>
              <span aria-hidden="true">🔥 {currentStreak}</span>
            </span>
            <span>
              <span className="sr-only">{t("training.sessionXp", { xp: sessionXp })}</span>
              <span aria-hidden="true">⭐ {sessionXp}</span>
            </span>
          </span>
        </div>
        <ProgressBar
          value={current - 1}
          max={total}
          size="thin"
          label={t("training.questionLabel", { current, total })}
          colorClassName="bg-primary"
        />

        <h2 className="text-center text-xl font-extrabold sm:text-2xl">
          {t("training.whichCountry")}
        </h2>

        <motion.div
          key={session.currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:gap-6"
        >
          <Card className="mx-auto flex h-52 w-full max-w-3xl items-center justify-center bg-surface-raised p-4 sm:h-72 sm:p-6 lg:h-[29rem]">
            <FlagImage
              key={question.countryId}
              flagPath={country.flagPath}
              alt={t("training.flagAlt")}
              className="max-h-full max-w-full rounded-lg object-contain shadow-md"
            />
          </Card>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {question.optionCountryIds.map((optionId) => {
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
                    <p className="text-sm text-text-muted">{t("training.markedForReview")}</p>
                  </>
                )}
                {feedback.promoted && (
                  <p className="text-sm font-bold text-success">
                    {t("training.masteryUp", {
                      country: getCountryName(country, locale),
                      from: t(`mastery.${feedback.masteryBefore}`),
                      to: t(`mastery.${feedback.masteryAfter}`),
                    })}
                  </p>
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
