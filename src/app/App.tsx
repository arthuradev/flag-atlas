import { DebugConsole } from "@/features/debug/DebugConsole";
import { Providers } from "./providers";
import { AppRouter } from "./router";

export function App() {
  return (
    <Providers>
      <AppRouter />
      {/* ⚠️ Ferramenta de teste temporária — remover junto com src/features/debug/. */}
      <DebugConsole />
    </Providers>
  );
}
