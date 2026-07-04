import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { countSeenCountries } from "@/entities/progress/progress.selectors";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { ShareResultButton } from "@/features/share/components/ShareResultButton";
import { buildShareText } from "@/features/share/logic/shareText";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { COUNTRIES } from "@/shared/data/countries";

function CountryRow({ countryId, detail }: { countryId: string; detail?: string }) {
  const locale = useSettingsStore((state) => state.locale);
  const country = getCountryById(countryId);
  if (!country) {
    return null;
  }
  return (
    <li className="flex items-center gap-3 py-1.5">
      <FlagImage
        flagPath={country.flagPath}
        alt=""
        className="h-6 w-9 rounded-sm object-cover shadow-sm"
      />
      <span className="font-bold">{getCountryName(country, locale)}</span>
      {detail && <span className="ml-auto text-sm text-text-muted">{detail}</span>}
    </li>
  );
}

export function SessionResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storeSummary = useSessionStore((state) => state.summary);
  const startSession = useSessionStore((state) => state.startSession);
  const clearSession = useSessionStore((state) => state.clearSession);
  const progress = useProgressStore((state) => state.progress);
  // Congelado no mount: iniciar "mais uma" limpa o summary do store e esta
  // página não deve redirecionar para a Home durante a transição de rota.
  const [summary] = useState(storeSummary);

  useEffect(() => {
    if (summary) {
      playSound("complete");
    }
  }, [summary]);

  if (!summary) {
    return <Navigate to="/home" replace />;
  }

  const leveledUp = summary.levelAfter > summary.levelBefore;
  const isSurvival = summary.survival !== undefined;

  const handlePlayAgain = () => {
    playSound("click");
    // Navegar antes de iniciar: iniciar a sessão limpa o summary, o que
    // faria esta página redirecionar para a Home no re-render.
    navigate("/training", { replace: true });
    startSession(summary.config);
  };

  const handleReview = () => {
    playSound("click");
    navigate("/training", { replace: true });
    startSession({ mode: "review", questionType: "choice", size: summary.config.size });
  };

  const handleBackHome = () => {
    playSound("click");
    clearSession();
    navigate("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-4 py-8"
    >
      <header className="text-center">
        <motion.p
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="text-5xl"
          aria-hidden="true"
        >
          {isSurvival ? "🛡️" : "🎉"}
        </motion.p>
        <h1 className="mt-2 text-3xl font-extrabold">
          {t(isSurvival ? "survival.resultTitle" : "result.title")}
        </h1>
        {summary.survival && (
          <p className="mt-1 text-lg font-bold">
            {t("survival.resultScore", { score: summary.survival.score })}
          </p>
        )}
        {summary.survival?.isNewRecord && (
          <p className="mt-1 font-bold text-warning">🏆 {t("survival.newRecord")}</p>
        )}
        {summary.survival && !summary.survival.isNewRecord && summary.survival.previousBest > 0 && (
          <p className="mt-1 text-sm font-semibold text-text-muted">
            {t("survival.previousBest", { score: summary.survival.previousBest })}
          </p>
        )}
        {leveledUp && (
          <p className="mt-1 font-bold text-success">
            {t("result.levelUp", { level: summary.levelAfter })}
          </p>
        )}
        {summary.dailyStreak.countedToday && (
          <p className="mt-1 text-sm font-semibold text-text-muted" data-testid="result-streak">
            {t("streak.countsToday")} · {t("streak.days", { count: summary.dailyStreak.current })}
            {summary.dailyStreak.usedRestDay && <> · {t("streak.usedRest")}</>}
          </p>
        )}
      </header>

      <Card className="grid grid-cols-2 gap-3 text-lg font-bold">
        <span>✅ {t("result.correct", { count: summary.correctCount })}</span>
        <span>❌ {t("result.wrong", { count: summary.wrongCount })}</span>
        <span>🔥 {t("result.bestStreak", { count: summary.bestStreak })}</span>
        <span className="text-warning">⭐ {t("result.xpEarned", { xp: summary.xpEarned })}</span>
        <span className="col-span-2 text-sm font-semibold text-text-muted">
          {t("result.accuracy", { percent: summary.accuracy })}
        </span>
      </Card>

      {summary.unlockedAchievementIds.length > 0 && (
        <Card data-testid="result-achievements">
          <h2 className="mb-2 font-extrabold">🏆 {t("achievements.unlockedTitle")}</h2>
          <ul className="flex flex-col gap-1.5">
            {summary.unlockedAchievementIds.map((achievementId) => (
              <li key={achievementId} className="flex items-center gap-2">
                <span className="font-bold">{t(`achievements.items.${achievementId}.title`)}</span>
                <span className="text-sm text-text-muted">
                  {t(`achievements.items.${achievementId}.description`)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <DailyMissionsCard />

      {summary.promotions.length > 0 && (
        <Card>
          <h2 className="mb-2 font-extrabold">{t("result.promoted")}</h2>
          <ul>
            {summary.promotions.map((promotion) => (
              <CountryRow
                key={`${promotion.countryId}-${promotion.to}`}
                countryId={promotion.countryId}
                detail={`${t(`mastery.${promotion.from}`)} → ${t(`mastery.${promotion.to}`)}`}
              />
            ))}
          </ul>
        </Card>
      )}

      {summary.toReviewCountryIds.length > 0 && (
        <Card>
          <h2 className="mb-2 font-extrabold">{t("result.toReview")}</h2>
          <ul>
            {summary.toReviewCountryIds.map((countryId) => (
              <CountryRow key={countryId} countryId={countryId} />
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <Button size="lg" fullWidth onClick={handlePlayAgain}>
          {t("result.playAgain")}
        </Button>
        {summary.toReviewCountryIds.length > 0 && (
          <Button variant="secondary" size="lg" fullWidth onClick={handleReview}>
            🔁 {t("review.cta")}
          </Button>
        )}
        <ShareResultButton
          text={buildShareText({
            summary,
            seenCount: countSeenCountries(progress),
            totalCountries: COUNTRIES.length,
            t,
          })}
        />
        <Button variant="secondary" size="lg" fullWidth onClick={handleBackHome}>
          {t("common.backToHome")}
        </Button>
      </div>
    </motion.div>
  );
}
