import { DebugConsole } from "@/features/debug/DebugConsole";
import { Providers } from "./providers";
import { AppRouter } from "./router";

export function App() {
  return (
    <Providers>
      <AppRouter />
      {import.meta.env.DEV && <DebugConsole />}
    </Providers>
  );
}
