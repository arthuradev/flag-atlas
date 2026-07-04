import { getEquippedId } from "@/entities/cosmetic/cosmetic.selectors";
import type { CosmeticInventory, CosmeticType } from "@/entities/cosmetic/cosmetic.types";
import { useProgressStore } from "@/features/progress/store/progressStore";

/** Saldo de Moedas Atlas. */
export function useCoins(): number {
  return useProgressStore((state) => state.progress.cosmetics.coins);
}

/** Inventário cosmético completo (moedas, itens, equipados). */
export function useCosmeticInventory(): CosmeticInventory {
  return useProgressStore((state) => state.progress.cosmetics);
}

/** Id equipado de um tipo, já resolvido com fallback seguro. */
export function useEquippedId(type: CosmeticType): string {
  return useProgressStore((state) => getEquippedId(state.progress.cosmetics, type));
}
