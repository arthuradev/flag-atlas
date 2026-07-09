import type { ComponentProps } from "react";
import { orbiAccessoryFor } from "@/features/cosmetics/logic/orbiCosmetics";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { Orbi } from "@/shared/brand/Orbi";

type EquippedOrbiProps = Omit<ComponentProps<typeof Orbi>, "accessory">;

/** Orbi com o cosmético equipado da Loja (fim de lição, feedbacks, perfil). */
export function EquippedOrbi(props: EquippedOrbiProps) {
  const orbiCosmeticId = useEquippedId("orbiCosmetic");
  return <Orbi {...props} accessory={orbiAccessoryFor(orbiCosmeticId)} />;
}
