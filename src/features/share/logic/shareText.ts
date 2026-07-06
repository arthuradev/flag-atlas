import type { TFunction } from "i18next";
import type { SessionSummary } from "@/entities/session/session.types";

/** URL pública do app (GitHub Pages). Sem backend: o texto é gerado localmente. */
export const SHARE_URL = "https://arthuradev.github.io/flag-atlas/";

type BuildShareTextParams = {
  summary: SessionSummary;
  seenCount: number;
  totalCountries: number;
  t: TFunction;
};

/**
 * Texto compartilhável do resumo da sessão. Apenas números do jogo:
 * nenhum dado sensível ou identificador do usuário.
 */
export function buildShareText({
  summary,
  seenCount,
  totalCountries,
  t,
}: BuildShareTextParams): string {
  const skippedCount = summary.skippedCount ?? 0;
  const totalAnswers = summary.correctCount + summary.wrongCount + skippedCount;
  const skippedStats =
    skippedCount > 0
      ? [
          t("share.wrongLine", { count: summary.wrongCount }),
          t("share.skippedLine", { count: skippedCount }),
        ]
      : [];
  const stats = summary.survival
    ? [
        t("share.scoreLine", { score: summary.survival.score }),
        t("share.survivalCorrectLine", { count: summary.correctCount }),
        t("share.survivalWrongLine", { count: summary.wrongCount }),
        ...(skippedCount > 0 ? [t("share.skippedLine", { count: skippedCount })] : []),
        t("share.bestStreakLine", { count: summary.bestStreak }),
      ]
    : [
        t("share.correctLine", {
          correct: summary.correctCount,
          total: totalAnswers,
        }),
        ...skippedStats,
        t("share.bestStreakLine", { count: summary.bestStreak }),
        t("share.xpLine", { xp: summary.xpEarned }),
        t("share.seenLine", { seen: seenCount, total: totalCountries }),
      ];

  return [
    t("share.header"),
    t(summary.survival ? "share.survivalTitle" : "share.sessionTitle"),
    "",
    ...stats,
    "",
    t("share.playToo", { url: SHARE_URL }),
  ].join("\n");
}

export type ShareOutcome = "shared" | "copied" | "dismissed" | "failed";

/**
 * Web Share API quando disponível; senão Clipboard API; senão "failed"
 * (a UI mostra o texto em uma área selecionável).
 */
export async function shareOrCopyText(text: string): Promise<ShareOutcome> {
  const nav = globalThis.navigator as Navigator | undefined;

  if (nav && typeof nav.share === "function") {
    try {
      await nav.share({ text });
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Usuário fechou o diálogo: não é erro nem sucesso.
        return "dismissed";
      }
      // Share indisponível de verdade (ex.: sem permissão): tenta copiar.
    }
  }

  try {
    if (!nav?.clipboard) {
      return "failed";
    }
    await nav.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
