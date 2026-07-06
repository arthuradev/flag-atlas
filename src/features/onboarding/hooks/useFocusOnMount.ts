import { useEffect, useRef } from "react";

/**
 * Moves focus to an element when it mounts — used on each step's heading so a
 * screen reader announces the new step and keyboard focus follows the flow.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
