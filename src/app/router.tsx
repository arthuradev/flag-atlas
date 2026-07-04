import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { ChallengesPage } from "@/pages/ChallengesPage/ChallengesPage";
import { CollectionPage } from "@/pages/CollectionPage/CollectionPage";
import { ContinentPage } from "@/pages/ContinentPage/ContinentPage";
import { ContinentsPage } from "@/pages/ContinentsPage/ContinentsPage";
import { HomePage } from "@/pages/HomePage/HomePage";
import { OnboardingPage } from "@/pages/OnboardingPage/OnboardingPage";
import { SessionResultPage } from "@/pages/SessionResultPage/SessionResultPage";
import { SettingsPage } from "@/pages/SettingsPage/SettingsPage";
import { StatsPage } from "@/pages/StatsPage/StatsPage";
import { TrainingPage } from "@/pages/TrainingPage/TrainingPage";

function RootRedirect() {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  return <Navigate to={hasCompletedOnboarding ? "/home" : "/onboarding"} replace />;
}

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/session-result" element={<SessionResultPage />} />
        <Route path="/continents" element={<ContinentsPage />} />
        <Route path="/continents/:continentId" element={<ContinentPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
}
