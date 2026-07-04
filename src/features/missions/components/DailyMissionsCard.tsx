import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMissionsStore } from "@/features/missions/store/missionsStore";
import { Card } from "@/shared/components/Card";

/**
 * Bloco compacto "Missões de hoje" (Home e resumo de sessão).
 * Missões concluídas ficam marcadas; as demais mostram o progresso.
 */
export function DailyMissionsCard() {
  const { t } = useTranslation();
  const missions = useMissionsStore((state) => state.missions.missions);
  const refreshForToday = useMissionsStore((state) => state.refreshForToday);

  // Renova na virada do dia sem exigir reload.
  useEffect(() => {
    refreshForToday();
  }, [refreshForToday]);

  if (missions.length === 0) {
    return null;
  }

  return (
    <Card data-testid="daily-missions" className="flex flex-col gap-2 p-4">
      <h2 className="text-sm font-extrabold text-text-muted">{t("missions.title")}</h2>
      <ul className="flex flex-col gap-1.5">
        {missions.map((mission) => (
          <li key={mission.id} className="flex items-center justify-between gap-3 text-sm">
            <span className={mission.completed ? "text-text-muted line-through" : "font-semibold"}>
              {t(`missions.types.${mission.type}`, { target: mission.target })}
            </span>
            {mission.completed ? (
              <span className="font-bold text-success">
                <span aria-hidden="true">✓ </span>
                {t("missions.completed")}
              </span>
            ) : (
              <span className="shrink-0 font-bold text-text-muted">
                {t("missions.progress", { progress: mission.progress, target: mission.target })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
