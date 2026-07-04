import { useEffect } from "react";
import { playSound } from "./soundPlayer";

const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "summary",
  "[role='button']",
  "[role='link']",
  "[data-sound='click']",
].join(",");

const SILENT_SELECTOR = "[data-sound='off']";
const DISABLED_SELECTOR = "button, input, select, textarea, fieldset, optgroup, option";

type MaybeDisabledElement = Element & {
  disabled?: boolean;
};

function isDisabled(element: Element): boolean {
  const disabledControl = element.closest(DISABLED_SELECTOR) as MaybeDisabledElement | null;
  return Boolean(
    element.closest("[aria-disabled='true']") ||
      (disabledControl &&
        "disabled" in disabledControl &&
        typeof disabledControl.disabled === "boolean" &&
        disabledControl.disabled),
  );
}

function shouldPlayUiClickSound(target: EventTarget | null): boolean {
  if (typeof Element === "undefined" || !(target instanceof Element)) {
    return false;
  }
  if (target.closest(SILENT_SELECTOR)) {
    return false;
  }
  const interactiveTarget = target.closest(INTERACTIVE_SELECTOR);
  return Boolean(interactiveTarget && !isDisabled(interactiveTarget));
}

export function useUiClickSound(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }
      if (shouldPlayUiClickSound(event.target)) {
        playSound("click");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
