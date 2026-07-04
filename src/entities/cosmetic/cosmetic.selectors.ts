import { COSMETIC_CATALOG } from "./cosmetic.catalog";
import {
  COSMETIC_TYPES,
  type CosmeticInventory,
  type CosmeticItem,
  type CosmeticType,
  createInitialCosmeticEquipped,
  createInitialCosmeticInventory,
  DEFAULT_COSMETIC_IDS,
  EQUIPPED_KEY_BY_TYPE,
  isCosmeticType,
} from "./cosmetic.types";

export type PurchaseCheck =
  | { ok: true }
  | { ok: false; reason: "notFound" | "alreadyOwned" | "insufficientCoins" };

export function getCosmeticById(id: string): CosmeticItem | undefined {
  return COSMETIC_CATALOG.find((item) => item.id === id);
}

export function listCosmeticsByType(type: CosmeticType): CosmeticItem[] {
  return COSMETIC_CATALOG.filter((item) => item.type === type);
}

/** Item padrão (fallback) de um tipo. Sempre existe no catálogo. */
export function getDefaultCosmetic(type: CosmeticType): CosmeticItem {
  const item = getCosmeticById(DEFAULT_COSMETIC_IDS[type]);
  if (!item) {
    // Inalcançável: o catálogo sempre inclui os defaults (garantido por teste).
    throw new Error(`Missing default cosmetic for type ${type}`);
  }
  return item;
}

/** Item gratuito (price 0) é sempre possuído; os demais precisam ter sido comprados. */
export function isCosmeticOwned(inventory: CosmeticInventory, id: string): boolean {
  const item = getCosmeticById(id);
  if (!item) {
    return false;
  }
  return item.price === 0 || inventory.ownedItemIds.includes(id);
}

export function getOwnedCosmetics(inventory: CosmeticInventory): CosmeticItem[] {
  return COSMETIC_CATALOG.filter((item) => isCosmeticOwned(inventory, item.id));
}

/** Diz se uma compra é possível e, se não, por quê (para feedback amigável). */
export function canPurchaseCosmetic(inventory: CosmeticInventory, id: string): PurchaseCheck {
  const item = getCosmeticById(id);
  if (!item) {
    return { ok: false, reason: "notFound" };
  }
  if (isCosmeticOwned(inventory, id)) {
    return { ok: false, reason: "alreadyOwned" };
  }
  if (inventory.coins < item.price) {
    return { ok: false, reason: "insufficientCoins" };
  }
  return { ok: true };
}

/**
 * Compra o item se possível, descontando as moedas e adicionando-o ao inventário.
 * Compra impossível (sem saldo, duplicada, inexistente) devolve o inventário
 * inalterado — o chamador usa canPurchaseCosmetic para a mensagem.
 */
export function purchaseCosmetic(inventory: CosmeticInventory, id: string): CosmeticInventory {
  const check = canPurchaseCosmetic(inventory, id);
  if (!check.ok) {
    return inventory;
  }
  const item = getCosmeticById(id);
  if (!item) {
    return inventory;
  }
  return {
    ...inventory,
    coins: inventory.coins - item.price,
    ownedItemIds: [...inventory.ownedItemIds, id],
  };
}

/**
 * Equipa um item possuído. Equipar nunca custa moedas. Item inexistente ou
 * não possuído devolve o inventário inalterado.
 */
export function equipCosmetic(inventory: CosmeticInventory, id: string): CosmeticInventory {
  const item = getCosmeticById(id);
  if (!item || !isCosmeticOwned(inventory, id)) {
    return inventory;
  }
  const key = EQUIPPED_KEY_BY_TYPE[item.type];
  return {
    ...inventory,
    equipped: { ...inventory.equipped, [key]: id },
  };
}

/** Id equipado de um tipo, com fallback para o padrão quando inválido/não possuído. */
export function getEquippedId(inventory: CosmeticInventory, type: CosmeticType): string {
  const key = EQUIPPED_KEY_BY_TYPE[type];
  const equippedId = inventory.equipped[key];
  const item = getCosmeticById(equippedId);
  if (item && item.type === type && isCosmeticOwned(inventory, equippedId)) {
    return equippedId;
  }
  return DEFAULT_COSMETIC_IDS[type];
}

/** Itens equipados resolvidos por tipo, sempre válidos (fallback ao padrão). */
export function getEquippedCosmetics(
  inventory: CosmeticInventory,
): Record<CosmeticType, CosmeticItem> {
  const result = {} as Record<CosmeticType, CosmeticItem>;
  for (const type of COSMETIC_TYPES) {
    result[type] = getCosmeticById(getEquippedId(inventory, type)) ?? getDefaultCosmetic(type);
  }
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toSafeCoins(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
}

/**
 * Normaliza o inventário de cosméticos vindo do localStorage.
 * Progresso antigo (V1/V2/V3) sem inventário recebe defaults seguros;
 * moedas inválidas viram 0, itens desconhecidos são descartados e itens
 * equipados inválidos voltam ao padrão. Nunca lança.
 */
export function normalizeCosmeticInventory(value: unknown): CosmeticInventory {
  if (!isRecord(value)) {
    return createInitialCosmeticInventory();
  }

  const ownedItemIds: string[] = [];
  if (Array.isArray(value.ownedItemIds)) {
    for (const id of value.ownedItemIds) {
      if (typeof id === "string" && getCosmeticById(id) && !ownedItemIds.includes(id)) {
        ownedItemIds.push(id);
      }
    }
  }

  const inventory: CosmeticInventory = {
    coins: toSafeCoins(value.coins),
    ownedItemIds,
    equipped: createInitialCosmeticEquipped(),
  };

  // Resolve cada equipado com o mesmo fallback usado em runtime, agora que
  // coins/owned já estão normalizados.
  const rawEquipped = isRecord(value.equipped) ? value.equipped : {};
  for (const type of COSMETIC_TYPES) {
    const key = EQUIPPED_KEY_BY_TYPE[type];
    const rawId = rawEquipped[key];
    if (typeof rawId === "string") {
      const item = getCosmeticById(rawId);
      if (item && item.type === type && isCosmeticOwned(inventory, rawId)) {
        inventory.equipped[key] = rawId;
      }
    }
  }

  return inventory;
}

export { isCosmeticType };
