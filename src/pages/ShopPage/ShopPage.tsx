import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  canPurchaseCosmetic,
  getCosmeticById,
  getEquippedId,
  isCosmeticOwned,
  listCosmeticsByType,
} from "@/entities/cosmetic/cosmetic.selectors";
import type { CosmeticItem, CosmeticRarity } from "@/entities/cosmetic/cosmetic.types";
import {
  SHOP_CATEGORIES,
  SHOP_CATEGORY_ICON,
  SHOP_CATEGORY_TYPE,
  type ShopCategory,
} from "@/entities/cosmetic/shop.categories";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { CosmeticPreview } from "@/features/cosmetics/components/CosmeticPreview";
import { VisualEffectBurst } from "@/features/cosmetics/components/VisualEffectBurst";
import { useCosmeticInventory } from "@/features/cosmetics/store/useCosmetics";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";

/** Tinta da zona de arte por categoria (linguagem do design). */
const CATEGORY_TINT: Record<ShopCategory, string> = {
  orbi: "#12C2D6",
  avatar: "#FF6F5C",
  themes: "#8A79D6",
  frames: "#E7A81E",
};

const RARITY_CHIP_CLASSES: Record<CosmeticRarity, string> = {
  common: "bg-surface-2 text-text-muted",
  rare: "bg-[#12C2D6] text-[#062A33]",
  epic: "bg-[#8A79D6] text-white",
  legendary: "bg-[#FFC24B] text-[#5A3D06]",
  seasonal: "bg-[#FF6F5C] text-white",
};

/** Item em destaque: o primeiro épico/lendário ainda não possuído da vitrine. */
const FEATURED_CANDIDATE_IDS = [
  "orbi-explorer-hat",
  "avatar-prism",
  "orbi-crown",
  "frame-ouro",
  "theme-espaco",
];

type ShopItemCardProps = {
  item: CosmeticItem;
  tint: string;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
};

function ShopItemCard({
  item,
  tint,
  owned,
  equipped,
  affordable,
  onBuy,
  onEquip,
}: ShopItemCardProps) {
  const { t } = useTranslation();
  const isFree = item.price === 0;

  return (
    <div
      data-testid="cosmetic-item"
      data-item-id={item.id}
      data-owned={owned}
      data-equipped={equipped}
      className={`relative overflow-hidden rounded-2xl border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${
        equipped ? "border-primary" : "border-line"
      }`}
    >
      {item.rarity && item.rarity !== "common" && (
        <span
          className={`absolute left-2.5 top-2.5 z-[1] rounded-full px-2 py-[3px] text-[9.5px] font-black uppercase tracking-[0.05em] ${RARITY_CHIP_CLASSES[item.rarity]}`}
        >
          {t(`cosmetics.rarity.${item.rarity}`)}
        </span>
      )}

      <div
        className="flex h-24 items-center justify-center"
        style={{ background: `linear-gradient(150deg, ${tint}20, ${tint}0a)` }}
      >
        <CosmeticPreview item={item} />
      </div>

      <div className="px-3.5 pb-3.5 pt-3">
        <p className="flex items-center gap-1.5 text-sm font-black text-text">
          <span className="truncate">{t(item.nameKey)}</span>
          {isFree && (
            <span className="shrink-0 rounded-full bg-success-soft px-1.5 py-px text-[9.5px] font-black uppercase text-success">
              {t("cosmetics.free")}
            </span>
          )}
        </p>
        <p className="mt-0.5 line-clamp-2 min-h-[2.1rem] text-[11.5px] font-semibold leading-[1.35] text-text-muted">
          {t(item.descriptionKey)}
        </p>

        {equipped ? (
          <span
            data-testid="cosmetic-equipped-badge"
            className="mt-[11px] flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-primary py-2.5 text-[13px] font-extrabold text-primary-foreground"
          >
            <Icon name="check" size={15} strokeWidth={2.6} />
            {t("cosmetics.equipped")}
          </span>
        ) : owned ? (
          <button
            type="button"
            onClick={() => onEquip(item.id)}
            className="mt-[11px] flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[11px] bg-pine-soft py-2.5 text-[13px] font-extrabold text-primary transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("cosmetics.equip")}
          </button>
        ) : (
          <button
            type="button"
            disabled={!affordable}
            aria-label={t("shop.buyForAria", { name: t(item.nameKey), price: item.price })}
            onClick={() => onBuy(item.id)}
            className="mt-[11px] flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[11px] bg-accent-soft py-2.5 text-[13px] font-extrabold text-ocre-ink transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Icon name="coin" size={15} />
            {item.price}
          </button>
        )}
      </div>
    </div>
  );
}

export function ShopPage() {
  const { t } = useTranslation();
  const inventory = useCosmeticInventory();
  const purchaseCosmetic = useProgressStore((state) => state.purchaseCosmetic);
  const equipCosmetic = useProgressStore((state) => state.equipCosmetic);
  const [category, setCategory] = useState<ShopCategory>("orbi");
  const [message, setMessage] = useState("");
  const [effectKey, setEffectKey] = useState(0);

  const activeType = SHOP_CATEGORY_TYPE[category];
  const items = useMemo(() => listCosmeticsByType(activeType), [activeType]);
  const equippedId = getEquippedId(inventory, activeType);

  const featuredItem = FEATURED_CANDIDATE_IDS.map((id) => getCosmeticById(id)).find(
    (item): item is CosmeticItem => item !== undefined && !isCosmeticOwned(inventory, item.id),
  );

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
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-5 py-1">
      <VisualEffectBurst playKey={effectKey} />

      <header className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[25px] font-black tracking-[-0.02em] text-text">{t("shop.title")}</h1>
          <p className="mt-0.5 text-sm font-semibold text-text-muted">{t("shop.subtitle")}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent-soft px-[15px] py-[9px]">
          <CoinBalance className="text-sm" />
          <span className="text-[11px] font-extrabold text-ocre-ink opacity-80">
            {t("cosmetics.coinsShort")}
          </span>
        </span>
      </header>

      {featuredItem && (
        <section
          aria-labelledby="shop-featured-title"
          className="relative flex items-center gap-6 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#173A5C] to-[#0F2A44] px-7 py-[26px] text-white shadow-[0_22px_44px_-26px_rgba(0,0,0,0.5)]"
        >
          <div className="pointer-events-none absolute -bottom-[60px] -left-10 size-[190px] rounded-full bg-[#12C2D6]/[0.14]" />
          <div className="relative flex size-[130px] shrink-0 items-center justify-center drop-shadow-[0_14px_20px_rgba(0,0,0,0.4)]">
            <CosmeticPreview item={featuredItem} size="lg" />
          </div>
          <div className="relative min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-white/[0.14] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#7FE6EF]">
              {t("shop.featured")}
            </span>
            <h2 id="shop-featured-title" className="mt-2.5 text-[23px] font-black">
              {t(featuredItem.nameKey)}
            </h2>
            <p className="mt-1 max-w-[420px] text-[13.5px] font-semibold text-[#EAF2F8]/80">
              {t(featuredItem.descriptionKey)}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={inventory.coins < featuredItem.price}
                onClick={() => handleBuy(featuredItem.id)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-[13px] bg-accent px-6 py-[13px] text-sm font-black text-[#5A3D06] shadow-[0_5px_0_#C98F1E] transition active:translate-y-[3px] active:shadow-[0_2px_0_#C98F1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Icon name="coin" size={17} />
                {t("shop.redeemFor", { price: featuredItem.price })}
              </button>
              <span className="text-[12.5px] font-bold text-[#EAF2F8]/60">
                {t("shop.youHave", { coins: inventory.coins })}
              </span>
            </div>
          </div>
        </section>
      )}

      <p aria-live="polite" className="-my-2 min-h-5 text-sm font-bold text-success">
        {message}
      </p>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{t("shop.categoriesLabel")}</legend>
        <div className="flex flex-wrap items-center gap-[9px]">
          {SHOP_CATEGORIES.map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={category === entry}
              onClick={() => setCategory(entry)}
              className={`inline-flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-full px-[15px] py-[9px] text-[12.5px] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                category === entry
                  ? "bg-primary text-primary-foreground"
                  : "border border-line bg-surface text-text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon name={SHOP_CATEGORY_ICON[entry]} size={15} />
              {t(`cosmetics.shopCategories.${entry}`)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            tint={CATEGORY_TINT[category]}
            owned={isCosmeticOwned(inventory, item.id)}
            equipped={equippedId === item.id}
            affordable={inventory.coins >= item.price}
            onBuy={handleBuy}
            onEquip={handleEquip}
          />
        ))}
      </div>

      <p className="pb-2 text-center text-[11px] font-bold text-faint">
        {t("shop.noRealMoney")} · {t("shop.cosmeticOnly")}
      </p>
    </PageTransition>
  );
}
