import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  canPurchaseCosmetic,
  getEquippedId,
  isCosmeticOwned,
  listCosmeticsByType,
} from "@/entities/cosmetic/cosmetic.selectors";
import { COSMETIC_TYPES } from "@/entities/cosmetic/cosmetic.types";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { CosmeticItemCard } from "@/features/cosmetics/components/CosmeticItemCard";
import { VisualEffectBurst } from "@/features/cosmetics/components/VisualEffectBurst";
import { useCosmeticInventory } from "@/features/cosmetics/store/useCosmetics";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Card } from "@/shared/components/Card";
import { PageShell } from "@/shared/components/PageShell";

export function ShopPage() {
  const { t } = useTranslation();
  const inventory = useCosmeticInventory();
  const purchaseCosmetic = useProgressStore((state) => state.purchaseCosmetic);
  const equipCosmetic = useProgressStore((state) => state.equipCosmetic);
  const [message, setMessage] = useState("");
  const [effectKey, setEffectKey] = useState(0);

  const handleBuy = (id: string) => {
    const check = canPurchaseCosmetic(inventory, id);
    if (!check.ok) {
      if (check.reason === "insufficientCoins") {
        setMessage(t("cosmetics.insufficient"));
      }
      return;
    }
    purchaseCosmetic(id);
    setMessage(t("cosmetics.purchased"));
    setEffectKey((key) => key + 1);
  };

  const handleEquip = (id: string) => {
    equipCosmetic(id);
    setMessage(t("cosmetics.itemEquipped"));
  };

  return (
    <PageShell title={t("shop.title")} backTo="/home" width="wide">
      <div className="relative flex flex-col gap-5 pb-6">
        <VisualEffectBurst playKey={effectKey} />

        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-extrabold">{t("shop.tagline")}</p>
            <CoinBalance className="text-lg" />
          </div>
          <p className="text-sm text-text-muted">{t("shop.subtitle")}</p>
          <p className="text-xs font-bold text-text-muted">
            {t("shop.noRealMoney")} · {t("shop.cosmeticOnly")}
          </p>
        </Card>

        <p aria-live="polite" className="min-h-5 text-sm font-bold text-success">
          {message}
        </p>

        {COSMETIC_TYPES.map((type) => {
          const equippedId = getEquippedId(inventory, type);
          return (
            <section key={type} className="flex flex-col gap-3" aria-labelledby={`shop-${type}`}>
              <h2 id={`shop-${type}`} className="text-lg font-extrabold">
                {t(`cosmetics.categories.${type}`)}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {listCosmeticsByType(type).map((item) => (
                  <CosmeticItemCard
                    key={item.id}
                    item={item}
                    owned={isCosmeticOwned(inventory, item.id)}
                    equipped={equippedId === item.id}
                    affordable={inventory.coins >= item.price}
                    onBuy={handleBuy}
                    onEquip={handleEquip}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
