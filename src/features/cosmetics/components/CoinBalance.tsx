import { useTranslation } from "react-i18next";
import { useCoins } from "@/features/cosmetics/store/useCosmetics";

type CoinBalanceProps = {
  className?: string;
};

/** Saldo de Moedas Atlas, discreto e acessível (não depende só do emoji). */
export function CoinBalance({ className = "" }: CoinBalanceProps) {
  const { t } = useTranslation();
  const coins = useCoins();
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold text-warning ${className}`}
      data-testid="coin-balance"
    >
      <span aria-hidden="true">🪙</span>
      <span>{coins}</span>
      <span className="sr-only">{t("cosmetics.coinsName")}</span>
    </span>
  );
}
