/**
 * Camada de domínio dos cosméticos da Versão 4.
 *
 * Cosméticos são puramente estéticos e locais: não alteram dificuldade,
 * XP real, domínio, aprendizado ou vantagem. As "Moedas Atlas" que os
 * compram são ganhas jogando, não têm valor real e nunca envolvem dinheiro.
 */

export const COSMETIC_TYPES = [
  "theme",
  "soundPack",
  "flagFrame",
  "mascot",
  "visualEffect",
] as const;

export type CosmeticType = (typeof COSMETIC_TYPES)[number];

export const COSMETIC_RARITIES = ["common", "rare", "epic", "legendary"] as const;

export type CosmeticRarity = (typeof COSMETIC_RARITIES)[number];

export type CosmeticItem = {
  id: string;
  type: CosmeticType;
  /** Chave i18n do nome exibível. */
  nameKey: string;
  /** Chave i18n da descrição exibível. */
  descriptionKey: string;
  /** Preço em Moedas Atlas. Itens gratuitos têm price 0 e são sempre possuídos. */
  price: number;
  rarity?: CosmeticRarity;
  /** Token curto (emoji) usado no preview simples da loja. */
  preview?: string;
  /** Item padrão equipado por padrão no seu tipo; nunca vendável nem bloqueável. */
  isDefault?: boolean;
};

/** Item equipado por tipo de cosmético. Todos apontam para um id do catálogo. */
export type CosmeticEquipped = {
  themeId: string;
  soundPackId: string;
  flagFrameId: string;
  mascotId: string;
  visualEffectId: string;
};

export type CosmeticInventory = {
  /** Saldo de Moedas Atlas. Nunca negativo. */
  coins: number;
  /** Ids de itens comprados (defaults gratuitos não precisam estar aqui). */
  ownedItemIds: string[];
  equipped: CosmeticEquipped;
};

/** Id do item padrão equipado para cada tipo (fallback seguro). */
export const DEFAULT_COSMETIC_IDS: Record<CosmeticType, string> = {
  theme: "theme-default",
  soundPack: "sound-default",
  flagFrame: "frame-default",
  mascot: "mascot-none",
  visualEffect: "effect-none",
};

/** Mapeia um tipo de cosmético para a chave correspondente em CosmeticEquipped. */
export const EQUIPPED_KEY_BY_TYPE: Record<CosmeticType, keyof CosmeticEquipped> = {
  theme: "themeId",
  soundPack: "soundPackId",
  flagFrame: "flagFrameId",
  mascot: "mascotId",
  visualEffect: "visualEffectId",
};

export function createInitialCosmeticEquipped(): CosmeticEquipped {
  return {
    themeId: DEFAULT_COSMETIC_IDS.theme,
    soundPackId: DEFAULT_COSMETIC_IDS.soundPack,
    flagFrameId: DEFAULT_COSMETIC_IDS.flagFrame,
    mascotId: DEFAULT_COSMETIC_IDS.mascot,
    visualEffectId: DEFAULT_COSMETIC_IDS.visualEffect,
  };
}

export function createInitialCosmeticInventory(): CosmeticInventory {
  return {
    coins: 0,
    ownedItemIds: [],
    equipped: createInitialCosmeticEquipped(),
  };
}

export function isCosmeticType(value: unknown): value is CosmeticType {
  return COSMETIC_TYPES.includes(value as CosmeticType);
}
