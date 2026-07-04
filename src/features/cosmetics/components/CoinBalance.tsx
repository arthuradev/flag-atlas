import { useTranslation } from "react-i18next";
import { useCoins } from "@/features/cosmetics/store/useCosmetics";
import { Icon } from "@/shared/components/Icon";

type CoinBalanceProps = {
  className?: string;
};

export function CoinBalance({ className = "" }: CoinBalanceProps) {
  const { t } = useTranslation();
  const coins = useCoins();
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-extrabold text-warning ${className}`}
      data-testid="coin-balance"
    >
      <Icon name="coin" size={18} />
      <span>{coins}</span>
      <span className="sr-only">{t("cosmetics.coinsName")}</span>
    </span>
  );
}
