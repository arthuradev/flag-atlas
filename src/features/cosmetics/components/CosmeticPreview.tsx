import type { CosmeticItem } from "@/entities/cosmetic/cosmetic.types";
import { avatarStyleClass } from "@/features/cosmetics/logic/avatarStyles";
import { flagFrameClass } from "@/features/cosmetics/logic/flagFrames";
import { orbiAccessoryFor } from "@/features/cosmetics/logic/orbiCosmetics";
import { themeSwatch } from "@/features/cosmetics/logic/themeSwatches";
import { Orbi } from "@/shared/brand/Orbi";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";

type CosmeticPreviewProps = {
  item: CosmeticItem;
  /** "sm" para o card do grid, "lg" para o painel de preview. */
  size?: "sm" | "lg";
};

/** Preview visual de um cosmético: Orbi vestido, avatar, paleta ou moldura. */
export function CosmeticPreview({ item, size = "sm" }: CosmeticPreviewProps) {
  const isLarge = size === "lg";

  if (item.type === "orbiCosmetic") {
    return (
      <span className={isLarge ? "block w-32" : "block w-[72px]"}>
        <Orbi
          accessory={orbiAccessoryFor(item.id)}
          expression="sorriso"
          flag={false}
          feet={isLarge}
        />
      </span>
    );
  }

  if (item.type === "avatarCosmetic") {
    return (
      <span
        className={`flex items-center justify-center rounded-full text-white shadow-sm ${avatarStyleClass(item.id)} ${
          isLarge ? "size-24" : "size-12"
        }`}
      >
        <Icon name="user" size={isLarge ? 40 : 22} />
      </span>
    );
  }

  if (item.type === "theme") {
    const [background, primary, accent] = themeSwatch(item.id);
    return (
      <span
        className={`flex items-center justify-center gap-1.5 rounded-btn border border-line ${
          isLarge ? "h-24 w-full max-w-44 gap-2.5" : "size-12"
        }`}
        style={{ background }}
      >
        <span
          className={`rounded-full ${isLarge ? "size-7" : "size-3"}`}
          style={{ background: primary }}
        />
        <span
          className={`rounded-full ${isLarge ? "size-7" : "size-3"}`}
          style={{ background: accent }}
        />
      </span>
    );
  }

  if (item.type === "flagFrame") {
    return (
      <span
        className={`flex items-center justify-center rounded-md border border-line bg-white p-1 ${flagFrameClass(item.id)} ${
          isLarge ? "h-20 w-28 p-1.5" : "h-11 w-16"
        }`}
      >
        <FlagImage
          flagPath="flags/mvp/br.svg"
          alt=""
          className="max-h-full max-w-full rounded-[3px] object-contain"
        />
      </span>
    );
  }

  // soundPack/visualEffect não têm categoria na Loja; fallback por ícone.
  return (
    <span
      className={`flex items-center justify-center rounded-btn bg-pine-soft text-primary ${
        isLarge ? "size-24" : "size-12"
      }`}
    >
      <Icon name={item.icon} size={isLarge ? 40 : 24} strokeWidth={1.9} />
    </span>
  );
}
