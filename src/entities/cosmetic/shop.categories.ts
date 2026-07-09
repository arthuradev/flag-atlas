import type { IconName } from "@/shared/components/Icon";
import type { CosmeticType } from "./cosmetic.types";

/**
 * Categorias visuais da Loja Flaggo. São uma camada de apresentação sobre os
 * tipos internos de cosmético: soundPack e visualEffect continuam existindo
 * (e equipáveis via inventário), mas não têm categoria na Loja final.
 * A Loja não vende vantagem de gameplay — só personalização.
 */
export const SHOP_CATEGORIES = ["orbi", "avatar", "themes", "frames"] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const SHOP_CATEGORY_TYPE: Record<ShopCategory, CosmeticType> = {
  orbi: "orbiCosmetic",
  avatar: "avatarCosmetic",
  themes: "theme",
  frames: "flagFrame",
};

export const SHOP_CATEGORY_ICON: Record<ShopCategory, IconName> = {
  orbi: "globe",
  avatar: "user",
  themes: "palette",
  frames: "square",
};
