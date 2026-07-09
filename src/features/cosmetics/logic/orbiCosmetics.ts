import type { OrbiAccessory } from "@/shared/brand/Orbi";

/**
 * Mapeia itens "Cosméticos do Orbi" da Loja para o acessório desenhado pelo
 * componente Orbi. O item padrão (orbi-classic) não tem acessório; ids
 * desconhecidos também caem no visual clássico — nunca quebram o mascote.
 */
export const ORBI_ACCESSORY_BY_ITEM: Record<string, OrbiAccessory> = {
  "orbi-explorer-hat": "explorer-hat",
  "orbi-cap": "cap",
  "orbi-beanie": "beanie",
  "orbi-party-hat": "party-hat",
  "orbi-crown": "crown",
  "orbi-halo": "halo",
  "orbi-glasses": "glasses",
  "orbi-sunglasses": "sunglasses",
  "orbi-monocle": "monocle",
  "orbi-scarf": "scarf",
  "orbi-bowtie": "bowtie",
  "orbi-headphones": "headphones",
  "orbi-winter": "winter",
};

/** Acessório do Orbi para um item equipado (undefined = Orbi clássico). */
export function orbiAccessoryFor(itemId: string): OrbiAccessory | undefined {
  return ORBI_ACCESSORY_BY_ITEM[itemId];
}
