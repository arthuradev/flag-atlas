import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";

/** Saldo de moedas com atalho para a loja. */
export function CoinShortcutCard() {
  const { t } = useTranslation();

  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-btn bg-ocre-soft text-warning">
        <Icon name="coin" size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <CoinBalance className="text-2xl" />
        <p className="text-xs font-bold text-text-muted">{t("cosmetics.coinsName")}</p>
      </div>
      <Link
        to="/shop"
        className="rounded-chip bg-pine-soft px-3 py-2 text-sm font-extrabold text-primary hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("shop.visitShort")}
      </Link>
    </Card>
  );
}
