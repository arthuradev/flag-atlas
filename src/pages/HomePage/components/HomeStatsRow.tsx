import { useTranslation } from "react-i18next";
import {
  countLearnedCountries,
  countSeenCountries,
  listCountriesNeedingReview,
} from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Card } from "@/shared/components/Card";

/** Os três cartões de estatística rápida: vistos, aprendidos, a revisar. */
export function HomeStatsRow() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);

  const seen = countSeenCountries(progress);
  const learned = countLearnedCountries(progress);
  const reviewCount = listCountriesNeedingReview(progress).length;

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <Card className="p-4">
        <span className="text-2xl font-black text-text">{seen}</span>
        <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
          {t("home.seen")}
        </p>
      </Card>
      <Card className="p-4">
        <span className="text-2xl font-black text-text">{learned}</span>
        <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
          {t("stats.learned")}
        </p>
      </Card>
      <Card className="p-4">
        <span className="text-2xl font-black text-text">{reviewCount}</span>
        <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
          {t("home.toReview")}
        </p>
      </Card>
    </section>
  );
}
