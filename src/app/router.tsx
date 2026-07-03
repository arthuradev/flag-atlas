import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CollectionPage } from "@/pages/CollectionPage/CollectionPage";
import { ContinentPage } from "@/pages/ContinentPage/ContinentPage";
import { ContinentsPage } from "@/pages/ContinentsPage/ContinentsPage";
import { HomePage } from "@/pages/HomePage/HomePage";
import { OnboardingPage } from "@/pages/OnboardingPage/OnboardingPage";
import { SessionResultPage } from "@/pages/SessionResultPage/SessionResultPage";
import { SettingsPage } from "@/pages/SettingsPage/SettingsPage";
import { TrainingPage } from "@/pages/TrainingPage/TrainingPage";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/session-result" element={<SessionResultPage />} />
        <Route path="/continents" element={<ContinentsPage />} />
        <Route path="/continents/:continentId" element={<ContinentPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  );
}
