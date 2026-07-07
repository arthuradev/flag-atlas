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
  children: ReactNode;
};

export function OnboardingLayout({
  stepIndex,
  stepCount,
  animate = true,
  primary,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-background lg:grid lg:min-h-dvh lg:grid-cols-[1fr_1.15fr]">
      <WorldBackdrop animate={animate} className="lg:hidden" />
      <BrandPanel animate={animate} className="hidden lg:flex" />

      <div className="relative z-[2] flex min-h-dvh flex-col px-6 pb-6 lg:min-h-0 lg:justify-center lg:px-14 lg:py-12">
        <div className="mobile-safe-top flex items-center justify-between pt-6 lg:mb-8 lg:pt-0">
          <OnboardingProgress stepIndex={stepIndex} stepCount={stepCount} />
        </div>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6 lg:mx-0 lg:max-w-xl lg:flex-none lg:py-0">
          {children}
        </main>

        {primary && (
          <div className="mobile-safe-bottom flex flex-col items-stretch gap-3 pt-4 lg:mt-10 lg:flex-row lg:items-center lg:gap-4 lg:pt-0">
            <Button
              size="lg"
              fullWidth
              onClick={primary.onClick}
              disabled={primary.disabled}
              className="lg:w-auto lg:px-9"
            >
              {primary.label}
              <Icon
                name={primary.icon === "check" ? "check" : "arrow-right"}
                size={19}
                strokeWidth={2.6}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
