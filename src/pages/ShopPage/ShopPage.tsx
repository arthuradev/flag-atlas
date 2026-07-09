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

const RARITY_CHIP_CLASSES: Record<CosmeticRarity, string> = {
  common: "bg-surface-2 text-text-muted",
  rare: "bg-pine-soft text-primary",
  epic: "bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#C4B5FD]",
  legendary: "bg-accent-soft text-ocre-ink",
  seasonal: "bg-danger-soft text-danger",
};

/** Item em destaque: o primeiro épico/lendário ainda não possuído da vitrine. */
const FEATURED_CANDIDATE_IDS = [
  "orbi-explorer-hat",
  "avatar-prism",
  "orbi-crown",
  "frame-ouro",
  "theme-espaco",
];

function RarityChip({ rarity }: { rarity: CosmeticRarity }) {
  const { t } = useTranslation();
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-wide ${RARITY_CHIP_CLASSES[rarity]}`}
    >
      {t(`cosmetics.rarity.${rarity}`)}
    </span>
  );
}

type ShopItemCardProps = {
  item: CosmeticItem;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
};

function ShopItemCard({
  item,
  owned,
  equipped,
  affordable,
  selected,
  onSelect,
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
      className={`flex flex-col gap-3 rounded-card border bg-surface p-4 shadow-card transition ${
        equipped ? "border-primary" : selected ? "border-ring" : "border-line"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        aria-pressed={selected}
        className="flex cursor-pointer items-start gap-3 rounded-btn text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CosmeticPreview item={item} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-extrabold text-text">{t(item.nameKey)}</span>
            {item.rarity && <RarityChip rarity={item.rarity} />}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-text-muted">
            {t(item.descriptionKey)}
          </span>
        </span>
      </button>

      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-sm font-bold">
          {isFree ? (
            <span className="text-success">{t("cosmetics.free")}</span>
          ) : owned ? (
            <span className="text-text-muted">{t("cosmetics.owned")}</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-warning">
              <Icon name="coin" size={15} />
              {item.price}
              <span className="sr-only">{t("cosmetics.coinsName")}</span>
            </span>
          )}
        </span>

        {equipped ? (
          <span
            className="inline-flex min-h-9 items-center gap-1 rounded-btn bg-primary px-3.5 text-sm font-extrabold text-primary-foreground"
            data-testid="cosmetic-equipped-badge"
          >
            <Icon name="check" size={15} strokeWidth={2.6} /> {t("cosmetics.equipped")}
          </span>
        ) : owned ? (
          <button
            type="button"
            onClick={() => onEquip(item.id)}
            className="inline-flex min-h-9 cursor-pointer items-center rounded-btn bg-pine-soft px-3.5 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("cosmetics.equip")}
          </button>
        ) : (
          <button
            type="button"
            disabled={!affordable}
            onClick={() => onBuy(item.id)}
            className="inline-flex min-h-9 cursor-pointer items-center rounded-btn bg-primary px-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55"
          >
            {t("cosmetics.buy")}
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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [effectKey, setEffectKey] = useState(0);

  const activeType = SHOP_CATEGORY_TYPE[category];
  const items = useMemo(() => listCosmeticsByType(activeType), [activeType]);
  const equippedId = getEquippedId(inventory, activeType);
  const selectedItem =
    (selectedItemId ? getCosmeticById(selectedItemId) : undefined) ??
    getCosmeticById(equippedId) ??
    items[0];

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

  const handleSelectCategory = (next: ShopCategory) => {
    setCategory(next);
    setSelectedItemId(null);
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-4 py-1">
      <VisualEffectBurst playKey={effectKey} />

      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-text sm:text-[1.7rem]">{t("shop.title")}</h1>
          <p className="text-sm font-semibold text-text-muted">{t("shop.subtitle")}</p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-surface px-3.5 py-2 shadow-sm">
          <CoinBalance className="text-base" />
          <span className="ml-1.5 text-xs font-bold text-text-muted">
            {t("cosmetics.coinsShort")}
          </span>
        </span>
      </header>

      <p className="text-xs font-bold text-text-muted">
        {t("shop.noRealMoney")} · {t("shop.cosmeticOnly")}
      </p>

      {featuredItem && (
        <section
          aria-labelledby="shop-featured-title"
          className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-primary to-pine-hover p-6 text-white shadow-[0_22px_44px_-26px_rgba(0,0,0,0.55)]"
        >
          <div className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full bg-white/10" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="flex size-28 items-center justify-center rounded-card bg-white/15 p-2 shadow-sm">
              <CosmeticPreview item={featuredItem} size="lg" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-white/18 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em]">
                {t("shop.featured")}
              </span>
              <h2 id="shop-featured-title" className="mt-1.5 text-xl font-black leading-tight">
                {t(featuredItem.nameKey)}
              </h2>
              <p className="mt-1 max-w-[52ch] text-sm font-semibold text-white/85">
                {t(featuredItem.descriptionKey)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={inventory.coins < featuredItem.price}
                  onClick={() => handleBuy(featuredItem.id)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-btn bg-white px-5 text-sm font-black text-primary shadow-[0_6px_0_rgba(0,0,0,0.18)] transition active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Icon name="coin" size={16} />
                  {t("shop.redeemFor", { price: featuredItem.price })}
                </button>
                <span className="text-xs font-bold text-white/80">
                  {t("shop.youHave", { coins: inventory.coins })}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <p aria-live="polite" className="min-h-5 text-sm font-bold text-success">
        {message}
      </p>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{t("shop.categoriesLabel")}</legend>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SHOP_CATEGORIES.map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={category === entry}
              onClick={() => handleSelectCategory(entry)}
              className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                category === entry
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-line bg-surface text-text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon name={SHOP_CATEGORY_ICON[entry]} size={16} />
              {t(`cosmetics.shopCategories.${entry}`)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              owned={isCosmeticOwned(inventory, item.id)}
              equipped={getEquippedId(inventory, activeType) === item.id}
              affordable={inventory.coins >= item.price}
              selected={selectedItem?.id === item.id}
              onSelect={setSelectedItemId}
              onBuy={handleBuy}
              onEquip={handleEquip}
            />
          ))}
        </div>

        {selectedItem && (
          <aside className="rounded-card border border-line bg-surface p-5 shadow-card lg:sticky lg:top-8">
            <h2 className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted">
              {t("shop.previewTitle")}
            </h2>
            <div className="mt-3 flex min-h-36 items-center justify-center rounded-btn border border-line bg-surface-raised p-4">
              <CosmeticPreview item={selectedItem} size="lg" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-text">{t(selectedItem.nameKey)}</h3>
              {selectedItem.rarity && <RarityChip rarity={selectedItem.rarity} />}
            </div>
            <p className="mt-1 text-sm font-semibold text-text-muted">
              {t(selectedItem.descriptionKey)}
            </p>
            <div className="mt-4">
              {getEquippedId(inventory, selectedItem.type) === selectedItem.id ? (
                <span className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-btn bg-primary/15 px-4 font-extrabold text-primary">
                  <Icon name="check" size={17} strokeWidth={2.6} />
                  {t("cosmetics.equipped")}
                </span>
              ) : isCosmeticOwned(inventory, selectedItem.id) ? (
                <button
                  type="button"
                  onClick={() => handleEquip(selectedItem.id)}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-btn bg-primary px-4 font-extrabold text-primary-foreground shadow-btn transition hover:bg-pine-hover active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("cosmetics.equip")}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={inventory.coins < selectedItem.price}
                  onClick={() => handleBuy(selectedItem.id)}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-btn bg-primary px-4 font-extrabold text-primary-foreground shadow-btn transition hover:bg-pine-hover active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
                >
                  <Icon name="coin" size={16} />
                  {t("shop.buyFor", { price: selectedItem.price })}
                </button>
              )}
            </div>
          </aside>
        )}
      </div>
    </PageTransition>
  );
}
