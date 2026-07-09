import { useTranslation } from "react-i18next";
import {
  EXPEDITIONS,
  type ExpeditionDefinition,
  type ExpeditionStatus,
  getFeaturedExpedition,
} from "@/features/expeditions/expeditions.catalog";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Orbi } from "@/shared/brand/Orbi";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";

const STATUS_CHIP_CLASSES: Record<ExpeditionStatus, string> = {
  available: "bg-success-soft text-success",
  inProgress: "bg-pine-soft text-primary",
  locked: "bg-surface-2 text-text-muted",
  completed: "bg-success-soft text-success",
  premium: "bg-accent-soft text-ocre-ink",
};

function ExpeditionCard({ expedition }: { expedition: ExpeditionDefinition }) {
  const { t } = useTranslation();
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();
  const playable = expedition.session !== undefined && expedition.status === "available";

  const handleStart = () => {
    if (expedition.session) {
      startTraining({ ...expedition.session, size: defaultSessionSize });
    }
  };

  return (
    <li className="flex h-full flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-btn bg-pine-soft text-primary">
          <Icon name={expedition.icon} size={23} strokeWidth={1.9} />
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-wide ${STATUS_CHIP_CLASSES[expedition.status]}`}
        >
          {expedition.status === "locked" && <Icon name="lock" size={11} strokeWidth={2.4} />}
          {t(`expeditions.status.${expedition.status}`)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-extrabold text-text">
          {t(`expeditions.items.${expedition.id}.title`)}
        </h3>
        <p className="mt-0.5 text-sm font-semibold text-text-muted">
          {t(`expeditions.items.${expedition.id}.description`)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3 text-xs font-bold text-text-muted">
          <span>{t(`expeditions.difficulty.${expedition.difficulty}`)}</span>
          <span className="inline-flex items-center gap-1 text-warning">
            <Icon name="sparkles" size={14} />
            {t("expeditions.xpReward", { xp: expedition.xpReward })}
          </span>
        </span>
        {playable ? (
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-btn bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-btn transition hover:bg-pine-hover active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="play" size={15} fill="currentColor" strokeWidth={1.8} />
            {t("expeditions.exploreCta")}
          </button>
        ) : (
          <span className="inline-flex min-h-10 items-center rounded-btn border border-line bg-surface-2 px-4 text-sm font-extrabold text-text-muted">
            {expedition.status === "premium"
              ? t("expeditions.status.premium")
              : t("expeditions.comingSoon")}
          </span>
        )}
      </div>
    </li>
  );
}

export function ExpeditionsPage() {
  const { t } = useTranslation();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const featured = getFeaturedExpedition();
  const others = EXPEDITIONS.filter((expedition) => expedition.id !== featured.id);

  const handleStartFeatured = () => {
    if (featured.session) {
      startTraining({ ...featured.session, size: defaultSessionSize });
    }
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-4 py-1">
      <header className="min-w-0">
        <h1 className="text-2xl font-black text-text sm:text-[1.7rem]">{t("expeditions.title")}</h1>
        <p className="text-sm font-semibold text-text-muted">{t("expeditions.subtitle")}</p>
      </header>

      <section
        aria-labelledby="featured-expedition-title"
        className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-primary to-pine-hover p-6 text-white shadow-[0_22px_44px_-26px_rgba(0,0,0,0.55)] sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-14 size-48 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-6">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-white/18 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em]">
              {t("expeditions.featured")}
            </span>
            <h2 id="featured-expedition-title" className="mt-2 text-2xl font-black leading-tight">
              {t(`expeditions.items.${featured.id}.title`)}
            </h2>
            <p className="mt-1 max-w-[46ch] text-sm font-semibold text-white/85">
              {t(`expeditions.items.${featured.id}.description`)}
            </p>
            {featured.session ? (
              <button
                type="button"
                onClick={handleStartFeatured}
                className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-btn bg-white px-6 text-sm font-black uppercase tracking-[0.05em] text-primary shadow-[0_6px_0_rgba(0,0,0,0.18)] transition active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <Icon name="play" size={16} fill="currentColor" strokeWidth={1.8} />
                {t("expeditions.startCta")}
              </button>
            ) : (
              <span className="mt-5 inline-flex min-h-12 items-center rounded-btn bg-white/20 px-6 text-sm font-black uppercase tracking-[0.05em]">
                {t("expeditions.comingSoon")}
              </span>
            )}
          </div>
          <div className="hidden w-28 shrink-0 drop-shadow-[0_16px_22px_rgba(0,0,0,0.3)] sm:block lg:w-32">
            <Orbi expression="piscada" float={!reduceMotion} />
          </div>
        </div>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {others.map((expedition) => (
          <ExpeditionCard key={expedition.id} expedition={expedition} />
        ))}
        <li className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-surface-raised p-5 text-center">
          <span className="flex size-10 items-center justify-center rounded-btn bg-surface-2 text-text-muted">
            <Icon name="sparkles" size={20} />
          </span>
          <span className="text-sm font-extrabold text-text">{t("expeditions.moreTitle")}</span>
          <span className="text-xs font-bold text-text-muted">{t("expeditions.comingSoon")}</span>
        </li>
      </ul>
    </PageTransition>
  );
}
