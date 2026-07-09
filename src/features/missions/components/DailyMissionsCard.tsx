import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMissionsStore } from "@/features/missions/store/missionsStore";
import { Icon } from "@/shared/components/Icon";

/**
 * Missões do dia como trilha de passos (linguagem visual do design):
 * círculo verde concluído, círculo turquesa "agora", cadeado para as próximas.
 */
export function DailyMissionsCard() {
  const { t } = useTranslation();
  const missions = useMissionsStore((state) => state.missions.missions);
  const refreshForToday = useMissionsStore((state) => state.refreshForToday);

  useEffect(() => {
    refreshForToday();
  }, [refreshForToday]);

  if (missions.length === 0) {
    return null;
  }

  const activeIndex = missions.findIndex((mission) => !mission.completed);

  return (
    <section
      data-testid="daily-missions"
      aria-labelledby="daily-missions-title"
      className="rounded-[18px] border border-line bg-surface px-5 py-[18px] shadow-card"
    >
      <h2 id="daily-missions-title" className="mb-3.5 text-[15px] font-extrabold text-text">
        {t("missions.title")}
      </h2>
      <ul className="flex flex-col">
        {missions.map((mission, index) => {
          const isActive = index === activeIndex;
          const isLast = index === missions.length - 1;
          return (
            <li key={mission.id} className="flex gap-3.5">
              <span className="flex flex-col items-center">
                {mission.completed ? (
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-success text-white">
                    <Icon name="check" size={18} strokeWidth={2.6} />
                  </span>
                ) : isActive ? (
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_4px_var(--fa-primary-soft),0_10px_20px_-8px_var(--fa-primary)]">
                    <Icon name="play" size={17} fill="currentColor" strokeWidth={1.8} />
                  </span>
                ) : (
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-faint">
                    <Icon name="lock" size={16} />
                  </span>
                )}
                {!isLast && <span className="my-1 w-[3px] flex-1 rounded-sm bg-line-strong" />}
              </span>
              <span
                className={`flex min-w-0 flex-1 items-center justify-between gap-3 ${isLast ? "" : "pb-4"}`}
              >
                <span
                  className={`text-sm ${
                    mission.completed
                      ? "font-semibold text-text-muted line-through"
                      : isActive
                        ? "font-extrabold text-text"
                        : "font-semibold text-text-muted"
                  }`}
                >
                  {t(`missions.types.${mission.type}`, { target: mission.target })}
                </span>
                {mission.completed ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-success">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                    {t("missions.completed")}
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-extrabold text-text-muted">
                    {t("missions.progress", { progress: mission.progress, target: mission.target })}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
