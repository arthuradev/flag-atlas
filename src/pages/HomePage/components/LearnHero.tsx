import { useTranslation } from "react-i18next";
import type { Continent } from "@/entities/continent/continent.types";
import { countLearnedCountriesIn } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Orbi } from "@/shared/brand/Orbi";
import { Icon } from "@/shared/components/Icon";
import { CONTINENTS } from "@/shared/data/continents";

/**
 * Continente "ativo" da jornada: o que tem progresso mas ainda não terminou
 * (maior número de países vistos). Sem progresso nenhum, começa pelo primeiro.
 */
export function pickActiveContinent(
  countries: Record<string, { seenCount: number }>,
  learnedIn: (countryIds: readonly string[]) => number,
): Continent {
  const ordered = [...CONTINENTS].sort((a, b) => a.order - b.order);
  const fallback = ordered[0];
  if (!fallback) {
    // Inalcançável: o dataset de continentes é estático e nunca vazio.
    throw new Error("Continent dataset is empty");
  }
  let best: Continent | undefined;
  let bestSeen = 0;
  for (const continent of ordered) {
    const seen = continent.countryIds.filter((id) => (countries[id]?.seenCount ?? 0) > 0).length;
    const learned = learnedIn(continent.countryIds);
    if (seen > bestSeen && learned < continent.countryIds.length) {
      best = continent;
      bestSeen = seen;
    }
  }
  return best ?? fallback;
}

type LearnHeroProps = {
  isFirstRun: boolean;
};

/** Hero "Continue de onde parou": uma única ação em foco, com Orbi ao lado. */
export function LearnHero({ isFirstRun }: LearnHeroProps) {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const locale = useSettingsStore((state) => state.locale);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const continent = pickActiveContinent(progress.countries, (ids) =>
    countLearnedCountriesIn(progress, ids),
  );
  const learned = countLearnedCountriesIn(progress, continent.countryIds);
  const total = continent.countryIds.length;
  const hasContinentProgress = !isFirstRun && learned > 0 && learned < total;

  const handleContinue = () => {
    if (hasContinentProgress) {
      startTraining({
        mode: "continent",
        continentId: continent.id,
        questionType: "choice",
        size: defaultSessionSize,
      });
      return;
    }
    startTraining({ mode: "continue", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <section
      className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-primary to-pine-hover p-6 text-white shadow-[0_22px_44px_-26px_rgba(0,0,0,0.55)] sm:p-7"
      aria-labelledby="learn-hero-title"
    >
      <div className="pointer-events-none absolute -right-12 -top-14 size-52 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-24 right-28 size-36 rounded-full bg-white/[0.06]" />
      <div className="relative flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/80">
            {t("home.continueWhereLeft")}
          </p>
          <h2
            id="learn-hero-title"
            className="mt-1.5 text-2xl font-black leading-tight sm:text-[1.7rem]"
          >
            {isFirstRun ? t("home.firstTrainingTitle") : continent.names[locale]}
          </h2>
          <p className="mt-1 text-sm font-semibold text-white/85">
            {t("learn.heroSubtitle", { learned, total })}
          </p>
          <div className="mt-4 flex max-w-[340px] items-center gap-3">
            <span className="block h-2.5 flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                className="block h-full rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${total > 0 ? Math.round((learned / total) * 100) : 0}%` }}
              />
            </span>
            <span className="whitespace-nowrap text-[0.82rem] font-extrabold">
              {learned} / {total}
            </span>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-btn bg-white px-7 text-sm font-black uppercase tracking-[0.05em] text-primary shadow-[0_6px_0_rgba(0,0,0,0.18)] transition active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <Icon name="play" size={17} fill="currentColor" strokeWidth={1.8} />
            {t(isFirstRun ? "home.startFirstTraining" : "home.continueTraining")}
          </button>
        </div>
        <div className="hidden w-32 shrink-0 drop-shadow-[0_16px_22px_rgba(0,0,0,0.3)] sm:block lg:w-36">
          <Orbi expression="alegre" float={!reduceMotion} blink={!reduceMotion} />
        </div>
      </div>
    </section>
  );
}
