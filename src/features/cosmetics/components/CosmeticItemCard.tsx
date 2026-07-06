import { useTranslation } from "react-i18next";
import type { CosmeticItem } from "@/entities/cosmetic/cosmetic.types";
import { Button } from "@/shared/components/Button";
import { Icon } from "@/shared/components/Icon";

type CosmeticItemCardProps = {
  item: CosmeticItem;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
};

/** Card de um cosmético na loja: preview, preço e estado (comprar/equipar/equipado). */
export function CosmeticItemCard({
  item,
  owned,
  equipped,
  affordable,
  onBuy,
  onEquip,
}: CosmeticItemCardProps) {
  const { t } = useTranslation();
  const isFree = item.price === 0;

  return (
    <div
      data-testid="cosmetic-item"
      data-item-id={item.id}
      data-owned={owned}
      data-equipped={equipped}
      className={`flex flex-col gap-3 rounded-2xl border bg-surface p-4 shadow-sm ${
        equipped ? "border-primary" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pine-soft text-primary">
          <Icon name={item.icon} size={26} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold">{t(item.nameKey)}</h3>
            {item.rarity && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs font-bold text-text-muted">
                {t(`cosmetics.rarity.${item.rarity}`)}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-muted">{t(item.descriptionKey)}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <span className="text-sm font-bold">
          {isFree ? (
            <span className="text-success">{t("cosmetics.free")}</span>
          ) : owned ? (
            <span className="text-text-muted">{t("cosmetics.owned")}</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-warning">
              <Icon name="coin" size={16} />
              {item.price}
              <span className="sr-only">{t("cosmetics.coinsName")}</span>
            </span>
          )}
        </span>

        {equipped ? (
          <span
            className="inline-flex items-center gap-1 rounded-2xl bg-primary px-4 py-2 font-bold text-primary-foreground"
            data-testid="cosmetic-equipped-badge"
          >
            <Icon name="check" size={17} strokeWidth={2.4} /> {t("cosmetics.equipped")}
          </span>
        ) : owned ? (
          <Button size="md" onClick={() => onEquip(item.id)}>
            {t("cosmetics.equip")}
          </Button>
        ) : (
          <Button
            size="md"
            variant={affordable ? "primary" : "secondary"}
            disabled={!affordable}
            onClick={() => onBuy(item.id)}
          >
            {t("cosmetics.buy")}
          </Button>
        )}
      </div>
    </div>
  );
}
