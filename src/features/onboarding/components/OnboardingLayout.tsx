import type { ReactNode } from "react";
import { Button } from "@/shared/components/Button";
import { Icon } from "@/shared/components/Icon";
import { BrandPanel } from "./BrandPanel";
import { OnboardingProgress } from "./OnboardingProgress";
import { WorldBackdrop } from "./WorldBackdrop";

/**
 * The responsive frame every onboarding step shares.
 *
 * - Mobile: a single column over the world backdrop — progress + skip on top,
 *   the step centred, a chunky full-width action pinned to the bottom.
 * - Desktop (lg+): two columns — a persistent brand panel beside the focused
 *   content, with the action and skip inline.
 *
 * `primary` is omitted on the final (profile) step, which supplies its own
 * submit button; `onSkip` is likewise hidden there.
 */
type OnboardingLayoutProps = {
  stepIndex: number;
  stepCount: number;
  animate?: boolean;
  primary?:
    | { label: string; onClick: () => void; disabled?: boolean; icon?: "arrow" | "check" }
    | undefined;
  secondary?: { label: string; onClick: () => void; disabled?: boolean; icon?: "x" } | undefined;
  children: ReactNode;
};

export function OnboardingLayout({
  stepIndex,
  stepCount,
  animate = true,
  primary,
  secondary,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="fa-onb-stage relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-sidebar px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <WorldBackdrop animate={animate} className="opacity-35" />

      <section className="fa-onb-shell relative z-[2] grid h-[calc(100dvh-2rem)] w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-white/12 bg-background shadow-[0_50px_100px_-52px_rgba(0,0,0,0.85)] sm:h-[calc(100dvh-3rem)] lg:h-[680px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <BrandPanel animate={animate} stepIndex={stepIndex} className="hidden lg:flex" />

        <div className="relative flex min-h-0 flex-col overflow-hidden">
          <WorldBackdrop animate={animate} className="lg:hidden" />

          <div className="mobile-safe-top relative z-[2] flex items-center gap-4 px-5 pt-5 sm:px-8 lg:px-10 lg:pt-8">
            <OnboardingProgress stepIndex={stepIndex} stepCount={stepCount} />
          </div>

          <main className="relative z-[2] mx-auto flex min-h-0 w-full max-w-[760px] flex-1 flex-col justify-start overflow-y-auto px-5 py-6 sm:px-8 lg:justify-center lg:px-10 lg:py-8">
            {children}
          </main>

          {(primary || secondary) && (
            <footer className="relative z-[2] border-t border-line bg-surface/88 px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4 backdrop-blur sm:px-8 lg:px-10 lg:pb-6">
              <div className="mx-auto flex w-full max-w-[760px] flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-h-12">
                  {secondary && (
                    <Button
                      size="md"
                      variant="secondary"
                      onClick={secondary.onClick}
                      disabled={secondary.disabled}
                      className="w-full border-2 bg-transparent px-6 uppercase tracking-[0.04em] text-text-muted sm:w-auto"
                    >
                      {secondary.icon === "x" && <Icon name="x" size={17} strokeWidth={2.6} />}
                      {secondary.label}
                    </Button>
                  )}
                </div>

                {primary && (
                  <Button
                    size="lg"
                    fullWidth
                    onClick={primary.onClick}
                    disabled={primary.disabled}
                    className="mb-1 uppercase tracking-[0.04em] disabled:border disabled:border-line disabled:bg-surface-2 disabled:text-text-muted sm:w-auto sm:px-10"
                  >
                    <Icon
                      name={primary.icon === "check" ? "check" : "arrow-right"}
                      size={19}
                      strokeWidth={2.8}
                    />
                    {primary.label}
                  </Button>
                )}
              </div>
            </footer>
          )}
        </div>
      </section>
    </div>
  );
}
