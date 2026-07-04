import { useTranslation } from "react-i18next";
import type { DailyStreak } from "@/entities/progress/progress.types";
import { getDailyStreakStatus } from "@/features/progress/logic/dailyStreak";
import { getLocalDateKey } from "@/shared/utils/dateKey";

type DailyStreakLineProps = {
  streak: DailyStreak;
};

/**
 * Linha discreta do streak diário na Home. Sem culpa: quando a sequência
 * se perde, a mensagem é leve e sem vermelho.
 */
export function DailyStreakLine({ streak }: DailyStreakLineProps) {
  const { t } = useTranslation();
  const status = getDailyStreakStatus(streak, getLocalDateKey());

  if (status === "none") {
    return null;
  }

  if (status === "expired") {
    return (
      <p data-testid="daily-streak" className="text-center text-sm text-text-muted">
        {t("streak.noPressure")}
      </p>
    );
  }

  return (
    <p data-testid="daily-streak" className="text-center text-sm font-bold text-text-muted">
      {t("streak.days", { count: streak.currentStreak })}
      {status === "activeToday" && (
        <span className="font-semibold"> · {t("streak.countsToday")}</span>
      )}
      {status === "alive" && streak.restDaysAvailable > 0 && (
        <span className="font-semibold"> · {t("streak.restAvailable")}</span>
      )}
    </p>
  );
}
