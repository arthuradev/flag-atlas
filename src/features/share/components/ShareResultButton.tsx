import { useState } from "react";
import { useTranslation } from "react-i18next";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { type ShareOutcome, shareOrCopyText } from "../logic/shareText";

type ShareResultButtonProps = {
  text: string;
};

/**
 * Compartilha o resumo via Web Share API; sem ela, copia para a área de
 * transferência; se nada funcionar, expõe o texto selecionável.
 */
export function ShareResultButton({ text }: ShareResultButtonProps) {
  const { t } = useTranslation();
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleShare = async () => {
    playSound("click");
    setOutcome(await shareOrCopyText(text));
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" size="lg" fullWidth onClick={handleShare}>
        📤 {t(canNativeShare ? "share.share" : "share.copy")}
      </Button>
      <div aria-live="polite">
        {outcome === "copied" && (
          <p className="text-center text-sm font-bold text-success">{t("share.copied")}</p>
        )}
        {outcome === "failed" && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-sm font-bold text-text-muted">{t("share.copyFailed")}</p>
            <textarea
              readOnly
              value={text}
              rows={6}
              aria-label={t("share.textLabel")}
              onFocus={(event) => event.currentTarget.select()}
              className="w-full rounded-2xl border-2 border-border bg-surface p-3 text-sm font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>
    </div>
  );
}
