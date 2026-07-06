import {
  Capacitor,
  SystemBarType,
  SystemBars,
  SystemBarsStyle,
} from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from "@capacitor/haptics";

export const TRAINING_NATIVE_BACK_EVENT = "flag-atlas:request-training-exit";

let nativeExperienceSetup = false;

function isNativeApp() {
  return Capacitor.isNativePlatform();
}

function getCurrentHashPath() {
  return window.location.hash.split("?")[0] || "#/";
}

function isHomePath(path: string) {
  return path === "#/" || path === "#/home" || path === "#/onboarding";
}

function isTrainingPath(path: string) {
  return path === "#/training" || path.startsWith("#/training/");
}

export async function setupNativeMobileExperience() {
  if (!isNativeApp() || nativeExperienceSetup) {
    return;
  }

  nativeExperienceSetup = true;

  await setupSystemBars();
  await setupAndroidBackButton();
}

async function setupSystemBars() {
  try {
    await SystemBars.setStyle({
      style: SystemBarsStyle.Dark,
    });

    await SystemBars.hide({
      bar: SystemBarType.StatusBar,
      animation: "NONE",
    });

    await SystemBars.show({
      bar: SystemBarType.NavigationBar,
      animation: "NONE",
    });
  } catch (error) {
    console.warn("[native] Failed to configure system bars", error);
  }
}

async function setupAndroidBackButton() {
  try {
    await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const currentPath = getCurrentHashPath();

      if (isTrainingPath(currentPath)) {
        window.dispatchEvent(new CustomEvent(TRAINING_NATIVE_BACK_EVENT));
        return;
      }

      if (isHomePath(currentPath)) {
        void CapacitorApp.minimizeApp();
        return;
      }

      if (canGoBack) {
        window.history.back();
        return;
      }

      window.location.hash = "#/home";
    });
  } catch (error) {
    console.warn("[native] Failed to configure Android back button", error);
  }
}

export async function hapticLight() {
  if (!isNativeApp()) {
    return;
  }

  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Some devices may ignore haptics. That's okay.
  }
}

export async function hapticSuccess() {
  if (!isNativeApp()) {
    return;
  }

  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Some devices may ignore haptics. That's okay.
  }
}

export async function hapticError() {
  if (!isNativeApp()) {
    return;
  }

  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch {
    // Some devices may ignore haptics. That's okay.
  }
}