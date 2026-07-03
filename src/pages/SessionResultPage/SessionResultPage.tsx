import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";

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
  // Congelado no mount: iniciar "mais uma" limpa o summary do store e esta
  // página não deve redirecionar para a Home durante a transição de rota.
  const [summary] = useState(storeSummary);

  if (!summary) {
    return <Navigate to="/home" replace />;
  }

  const leveledUp = summary.levelAfter > summary.levelBefore;

  const handlePlayAgain = () => {
    // Navegar antes de iniciar: iniciar a sessão limpa o summary, o que
    // faria esta página redirecionar para a Home no re-render.
    navigate("/training", { replace: true });
    startSession(summary.config);
  };

  const handleBackHome = () => {
    clearSession();
    navigate("/home");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-5 px-4 py-8">
      <header className="text-center">
        <p className="text-5xl" aria-hidden="true">
          🎉
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{t("result.title")}</h1>
        {leveledUp && (
          <p className="mt-1 font-bold text-success">
            {t("result.levelUp", { level: summary.levelAfter })}
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
        <Button variant="secondary" size="lg" fullWidth onClick={handleBackHome}>
          {t("common.backToHome")}
        </Button>
      </div>
    </div>
  );
}
