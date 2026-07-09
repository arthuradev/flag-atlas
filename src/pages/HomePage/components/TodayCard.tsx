import { useTranslation } from "react-i18next";
import { countCountriesDueForReview } from "@/entities/progress/progress.selectors";
import type { DailyStreak } from "@/entities/progress/progress.types";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Icon } from "@/shared/components/Icon";
import { getLocalDateKey, isDateKey } from "@/shared/utils/dateKey";

type WeekDayState = "active" | "idle" | "future";

type WeekDay = {
  key: string;
  label: string;
  state: WeekDayState;
  isToday: boolean;
};

/** Data local (00:00) a partir de uma chave YYYY-MM-DD. */
function dateFromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/**
 * Semana atual (segunda a domingo) com os dias ativos derivados do streak:
 * um streak de N dias terminando em lastActiveDate implica que esses N dias
 * consecutivos foram jogados — nada além disso é inventado.
 */
export function buildWeekDays(streak: DailyStreak, locale: string, today = new Date()): WeekDay[] {
  const activeKeys = new Set<string>();
  if (streak.currentStreak > 0 && isDateKey(streak.lastActiveDate)) {
    const last = dateFromKey(streak.lastActiveDate);
    for (let i = 0; i < streak.currentStreak; i++) {
      const date = new Date(last);
      date.setDate(last.getDate() - i);
      activeKeys.add(getLocalDateKey(date));
    }
  }

  const todayKey = getLocalDateKey(today);
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const formatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = getLocalDateKey(date);
    const state: WeekDayState = activeKeys.has(key) ? "active" : key > todayKey ? "future" : "idle";
    return {
      key,
      label: formatter.format(date).toUpperCase(),
      state,
      isToday: key === todayKey,
    };
  });
}

/** Resumo do dia (design "Hoje"): sequência com semana, meta diária e revisões. */
export function TodayCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const dailyGoal = useOnboardingStore((state) => state.dailyGoal);
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const goal = dailyGoal ?? defaultSessionSize;
  const playedToday = progress.lastPlayedAt
    ? getLocalDateKey(new Date(progress.lastPlayedAt)) === getLocalDateKey()
    : false;
  const reviewCount = countCountriesDueForReview(progress);
  const week = buildWeekDays(progress.dailyStreak, locale);

  const handleReview = () => {
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <section
      aria-labelledby="today-title"
      className="rounded-[18px] border border-line bg-surface p-[18px] shadow-card"
    >
      <h2
        id="today-title"
        className="text-[13px] font-black uppercase tracking-[0.08em] text-text-muted"
      >
        {t("learn.today")}
      </h2>

      <div className="mt-3.5 flex items-center gap-3">
        <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[13px] bg-danger-soft text-danger">
          <Icon name="flame" size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[22px] font-black leading-none text-text">
            {progress.dailyStreak.currentStreak}{" "}
            <span className="text-[13px] font-extrabold text-text-muted">
              {t("home.streakDays")}
            </span>
          </p>
          <p className="mt-0.5 text-[11.5px] font-bold text-text-muted">
            {t("learn.dailyStreakLabel")}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex gap-[5px]" aria-hidden="true">
        {week.map((day) => (
          <div key={day.key} className="flex flex-1 flex-col items-center gap-[5px]">
            <span
              className={`text-[9.5px] font-extrabold ${
                day.isToday && day.state === "active" ? "text-danger" : "text-faint"
              }`}
            >
              {day.label}
            </span>
            <span
              className={`flex h-7 w-full items-center justify-center rounded-lg text-white ${
                day.state === "active"
                  ? "bg-danger"
                  : day.state === "future"
                    ? "border border-dashed border-line-strong bg-surface-2"
                    : "bg-surface-2"
              }`}
            >
              {day.state === "active" && <Icon name="flame" size={13} strokeWidth={2.4} />}
            </span>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-line" />

      <div className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-ocre-ink">
          <Icon name="zap" size={16} />
        </span>
        <span className="min-w-0 flex-1 text-[13.5px] font-extrabold text-text">
          {t("home.dailyGoal.title")}
        </span>
        <span className="text-xs font-extrabold text-text-muted">
          {playedToday ? t("learn.goalDone") : t("learn.goalPending", { goal })}
        </span>
      </div>
      <span className="mt-2.5 block h-2 overflow-hidden rounded-full bg-surface-2">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: playedToday ? "100%" : "0%" }}
        />
      </span>

      <div className="my-4 h-px bg-line" />

      <button
        type="button"
        onClick={handleReview}
        disabled={reviewCount === 0}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-btn text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
      >
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-pine-soft text-primary">
          <Icon name="refresh" size={16} />
        </span>
        <span className="min-w-0 flex-1 text-[13.5px] font-extrabold text-text">
          {t("learn.reviews")}
        </span>
        <span className="text-[13px] font-black text-primary">
          {reviewCount > 0 ? reviewCount : "—"}
        </span>
      </button>

      <div className="mt-3 empty:hidden">
        <DailyStreakLine streak={progress.dailyStreak} />
      </div>
    </section>
  );
}
