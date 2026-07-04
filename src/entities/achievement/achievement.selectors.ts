import type { UserProgress } from "@/entities/progress/progress.types";
import { ACHIEVEMENTS } from "./achievement.catalog";
import type { AchievementContext, AchievementView } from "./achievement.types";

/**
 * Ids de conquistas que acabaram de ser satisfeitas e ainda não estão
 * registradas no progresso. Avaliação pura: quem persiste é o store.
 */
export function evaluateNewAchievements(context: AchievementContext): string[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      context.progress.achievementsUnlocked[achievement.id] === undefined &&
      achievement.isUnlocked(context),
  ).map((achievement) => achievement.id);
}

/** Todas as conquistas prontas para exibição, desbloqueadas primeiro. */
export function listAchievementViews(progress: UserProgress): AchievementView[] {
  const views = ACHIEVEMENTS.map((achievement): AchievementView => {
    const unlockedAt = progress.achievementsUnlocked[achievement.id];
    return {
      id: achievement.id,
      category: achievement.category,
      emoji: achievement.emoji,
      unlocked: unlockedAt !== undefined,
      ...(unlockedAt !== undefined && { unlockedAt }),
      ...(achievement.getProgress && { progress: achievement.getProgress(progress) }),
    };
  });
  return [...views.filter((view) => view.unlocked), ...views.filter((view) => !view.unlocked)];
}

export function countUnlockedAchievements(progress: UserProgress): number {
  return ACHIEVEMENTS.filter(
    (achievement) => progress.achievementsUnlocked[achievement.id] !== undefined,
  ).length;
}
