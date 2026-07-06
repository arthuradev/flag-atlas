import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { countSeenCountries } from "@/entities/progress/progress.selectors";
import type { MasteryLevel } from "@/entities/progress/progress.types";
import type { MasteryPromotion, SessionSummary } from "@/entities/session/session.types";
import { VisualEffectBurst } from "@/features/cosmetics/components/VisualEffectBurst";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { MASTERY_BADGE_META, MAX_MASTERY_POINTS } from "@/features/progress/logic/mastery";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { ShareResultButton } from "@/features/share/components/ShareResultButton";
import { buildShareText } from "@/features/share/logic/shareText";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { COUNTRIES } from "@/shared/data/countries";

function CountryRow({ countryId, detail }: { countryId: string; detail?: ReactNode }) {
  const locale = useSettingsStore((state) => state.locale);
  const country = getCountryById(countryId);
  if (!country) {
    return null;
  }
  return (
    <li className="flex min-w-0 items-center gap-3 py-1.5">
      <FlagImage
        flagPath={country.flagPath}
        alt=""
        className="h-6 w-9 rounded-sm object-cover shadow-sm"
      />
      <span className="min-w-0 flex-1 truncate font-bold">{getCountryName(country, locale)}</span>
      {detail && <span className="ml-auto shrink-0 text-sm text-text-muted">{detail}</span>}
    </li>
  );
}

const BRONZE_PROMOTION_PREVIEW_LIMIT = 5;
const HIGHLIGHT_PROMOTION_PREVIEW_LIMIT = 3;

function isInitialBronzePromotion(promotion: MasteryPromotion): boolean {
  return promotion.from === "new" && promotion.to === "recognized";
}

function promotionPoints(promotion: MasteryPromotion): string | null {
  return promotion.pointsAfter === undefined
    ? null
    : `${promotion.pointsAfter}/${MAX_MASTERY_POINTS}`;
}

function tierNameForMastery(
  level: MasteryLevel,
  t: ReturnType<typeof useTranslation>["t"],
): string {
  return t(`mastery.badges.${MASTERY_BADGE_META[level].tier}`);
}

function BronzePromotionRow({ promotion }: { promotion: MasteryPromotion }) {
  const { t } = useTranslation();
  const points = promotionPoints(promotion);

  return (
    <CountryRow
      countryId={promotion.countryId}
      detail={
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-extrabold">
          <span>{tierNameForMastery(promotion.to, t)}</span>
          {points && <span className="text-text-muted">{points}</span>}
        </span>
      }
    />
  );
}

function HighlightPromotionRow({ promotion }: { promotion: MasteryPromotion }) {
  const locale = useSettingsStore((state) => state.locale);
  const country = getCountryById(promotion.countryId);
  const points = promotionPoints(promotion);

  if (!country) {
    return null;
  }

  return (
    <li className="rounded-card border border-line bg-surface-2 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <FlagImage
          flagPath={country.flagPath}
          alt=""
          className="h-7 w-10 shrink-0 rounded-sm object-cover shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-extrabold">{getCountryName(country, locale)}</p>
          <p className="mt-1 text-xs font-semibold text-text-muted">{points}</p>
        </div>
        <MasteryBadge masteryLevel={promotion.to} size="sm" showTier />
      </div>
    </li>
  );
}

function PromotionsCard({ promotions }: { promotions: SessionSummary["promotions"] }) {
  const { t } = useTranslation();
  const [isExpanded, setExpanded] = useState(false);
  const bronzePromotions = promotions.filter(isInitialBronzePromotion);
  const highlightedPromotions = promotions.filter(
    (promotion) => !isInitialBronzePromotion(promotion),
  );
  const visibleBronzePromotions = isExpanded
    ? bronzePromotions
    : bronzePromotions.slice(0, BRONZE_PROMOTION_PREVIEW_LIMIT);
  const visibleHighlightedPromotions = isExpanded
    ? highlightedPromotions
    : highlightedPromotions.slice(0, HIGHLIGHT_PROMOTION_PREVIEW_LIMIT);
  const visibleCount = visibleBronzePromotions.length + visibleHighlightedPromotions.length;
  const hiddenCount = promotions.length - visibleCount;
  const hasHiddenPromotions = hiddenCount > 0;
  const tierSummary = Object.entries(
    promotions.reduce<Record<string, number>>((counts, promotion) => {
      const tier = MASTERY_BADGE_META[promotion.to].tier;
      counts[tier] = (counts[tier] ?? 0) + 1;
      return counts;
    }, {}),
  )
    .filter(([tier]) => tier !== "none")
    .map(([tier, count]) =>
      t("result.badgesTierSummary", {
        count,
        tier: t(`mastery.badges.${tier}`),
      }),
    );

  if (promotions.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-extrabold">{t("result.promoted")}</h2>
          <p className="mt-1 text-sm font-semibold text-text-muted">{tierSummary.join(" · ")}</p>
        </div>
        {hasHiddenPromotions && (
          <span className="shrink-0 rounded-full bg-pine-soft px-2.5 py-1 text-xs font-extrabold text-primary">
            {t("result.badgesShowing", {
              shown: visibleCount,
              total: promotions.length,
            })}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {highlightedPromotions.length > 0 && (
          <ul className="flex flex-col gap-2">
            {visibleHighlightedPromotions.map((promotion) => (
              <HighlightPromotionRow
                key={`${promotion.countryId}-${promotion.to}`}
                promotion={promotion}
              />
            ))}
          </ul>
        )}

        {bronzePromotions.length > 0 && (
          <div className="rounded-card border border-line bg-background/60 px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-text-muted">
                {t("result.bronzeBadgesSummary", { count: bronzePromotions.length })}
              </h3>
              {hasHiddenPromotions && !isExpanded && (
                <span className="text-xs font-extrabold text-text-muted">
                  {t("result.badgesHiddenCount", { count: hiddenCount })}
                </span>
              )}
            </div>
            <ul className="divide-y divide-line">
              {visibleBronzePromotions.map((promotion) => (
                <BronzePromotionRow
                  key={`${promotion.countryId}-${promotion.to}`}
                  promotion={promotion}
                />
              ))}
            </ul>
          </div>
        )}

        {hasHiddenPromotions && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex min-h-10 items-center justify-center rounded-btn px-3 text-sm font-extrabold text-primary transition hover:bg-pine-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t(isExpanded ? "result.showFewerBadges" : "result.showAllBadges")}
          </button>
        )}
      </div>
    </Card>
  );
}

export function SessionResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storeSummary = useSessionStore((state) => state.summary);
  const startSession = useSessionStore((state) => state.startSession);
  const clearSession = useSessionStore((state) => state.clearSession);
  const dismissSummary = useSessionStore((state) => state.dismissSummary);
  const progress = useProgressStore((state) => state.progress);
  // Congelado no mount: iniciar "mais uma" limpa o summary do store e esta
  // página não deve redirecionar para a Home durante a transição de rota.
  const [summary] = useState(storeSummary);
  // Dispara o efeito visual cosmético uma vez ao abrir o resumo.
  const [effectKey] = useState(1);

  useEffect(() => {
    if (summary) {
      playSound("complete");
    }
  }, [summary]);

  useEffect(() => {
    if (summary) {
      dismissSummary();
    }
  }, [summary, dismissSummary]);

  if (!summary) {
    return <Navigate to="/home" replace />;
  }

  const leveledUp = summary.levelAfter > summary.levelBefore;
  const isSurvival = summary.survival !== undefined;
  const bonusAndMissionXp = summary.answerBonusXpEarned + summary.missionXpEarned;
  const skippedCount = summary.skippedCount ?? 0;

  const handlePlayAgain = () => {
    // Navegar antes de iniciar: iniciar a sessão limpa o summary, o que
    // faria esta página redirecionar para a Home no re-render.
    navigate("/training", { replace: true });
    startSession(summary.config);
  };

  const handleReview = () => {
    navigate("/training", { replace: true });
    startSession({ mode: "review", questionType: "choice", size: summary.config.size });
  };

  const handleBackHome = () => {
    clearSession();
    navigate("/home");
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-5 py-4 lg:min-h-0">
      <header className="relative text-center">
        <VisualEffectBurst playKey={effectKey} className="-top-8 h-40" />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pine-soft text-primary"
          aria-hidden="true"
        >
          <Icon name={isSurvival ? "shield" : "party"} size={38} strokeWidth={1.8} />
        </motion.div>
        <h1 className="mt-2 text-3xl font-extrabold">
          {t(isSurvival ? "survival.resultTitle" : "result.title")}
        </h1>
        {summary.survival && (
          <p className="mt-1 text-lg font-bold">
            {t("survival.resultScore", { score: summary.survival.score })}
          </p>
        )}
        {summary.survival?.isNewRecord && (
          <p className="mt-1 inline-flex items-center justify-center gap-1.5 font-bold text-warning">
            <Icon name="trophy" size={18} />
            {t("survival.newRecord")}
          </p>
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-start">
        <section className="flex flex-col gap-4">
          <Card className="grid grid-cols-2 gap-3 text-sm font-bold sm:grid-cols-3">
            <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3">
              <Icon name="check-circle" size={20} className="text-success" />
              {t("result.correct", { count: summary.correctCount })}
            </span>
            <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3">
              <Icon name="x-circle" size={20} className="text-danger" />
              {t("result.wrong", { count: summary.wrongCount })}
            </span>
            {skippedCount > 0 && (
              <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3">
                <Icon name="ban" size={20} className="text-muted" />
                {t("result.skipped", { count: skippedCount })}
              </span>
            )}
            <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3">
              <Icon name="percent" size={20} className="text-primary" />
              {t("result.accuracy", { percent: summary.accuracy })}
            </span>
            <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3">
              <Icon name="flame" size={20} className="text-danger" />
              {t("result.bestStreak", { count: summary.bestStreak })}
            </span>
            <span className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3 text-warning">
              <Icon name="star" size={20} />
              {t("result.xpEarned", { xp: summary.xpEarned })}
            </span>
            {summary.coinsEarned > 0 && (
              <span
                className="inline-flex min-h-12 items-center gap-1.5 rounded-2xl bg-surface-2 px-3 text-warning"
                data-testid="result-coins"
              >
                <Icon name="coin" size={18} />
                {t("result.coinsEarned", { count: summary.coinsEarned })}
              </span>
            )}
            {bonusAndMissionXp > 0 && (
              <p className="col-span-full text-sm font-semibold text-text-muted">
                {t("result.xpBreakdown", {
                  answersXp: summary.baseAnswerXpEarned,
                  bonusXp: bonusAndMissionXp,
                })}
              </p>
            )}
          </Card>

          <Card className="flex flex-col gap-3">
            <Button size="lg" fullWidth onClick={handlePlayAgain}>
              <Icon name="play" size={19} fill="currentColor" strokeWidth={1.8} />
              {t("result.playAgain")}
            </Button>
            {summary.toReviewCountryIds.length > 0 && (
              <Button variant="secondary" size="lg" fullWidth onClick={handleReview}>
                <Icon name="refresh" size={19} />
                {t("review.cta")}
              </Button>
            )}
            <Button variant="secondary" size="lg" fullWidth onClick={handleBackHome}>
              <Icon name="home" size={19} />
              {t("common.backToHome")}
            </Button>
            <ShareResultButton
              text={buildShareText({
                summary,
                seenCount: countSeenCountries(progress),
                totalCountries: COUNTRIES.length,
                t,
              })}
            />
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 text-center text-sm font-bold text-text-muted underline-offset-2 transition hover:text-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="shop" size={16} />
              {t("shop.visitShort")}
            </Link>
          </Card>
        </section>

        <aside className="flex flex-col gap-4">
          {summary.unlockedAchievementIds.length > 0 && (
            <Card data-testid="result-achievements">
              <h2 className="mb-2 inline-flex items-center gap-2 font-extrabold">
                <Icon name="trophy" size={20} className="text-gold" />
                {t("achievements.unlockedTitle")}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {summary.unlockedAchievementIds.map((achievementId) => (
                  <li key={achievementId} className="flex flex-col gap-0.5">
                    <span className="font-bold">
                      {t(`achievements.items.${achievementId}.title`)}
                    </span>
                    <span className="text-sm text-text-muted">
                      {t(`achievements.items.${achievementId}.description`)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <DailyMissionsCard />

          <PromotionsCard promotions={summary.promotions} />

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
        </aside>
      </div>
    </PageTransition>
  );
}
