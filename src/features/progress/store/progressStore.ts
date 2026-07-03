import { create } from "zustand";
import { createInitialUserProgress, type UserProgress } from "@/entities/progress/progress.types";

type ProgressState = {
  progress: UserProgress;
};

/**
 * Progresso do usuário. Persistência, XP e domínio são adicionados na Fase 5;
 * por enquanto a Home lê o estado inicial vazio.
 */
export const useProgressStore = create<ProgressState>(() => ({
  progress: createInitialUserProgress(),
}));
