import { useEffect, useRef, useState } from "react";
import { runDebugCommand } from "./debugCommands";

/**
 * ⚠️ FERRAMENTA DE TESTE TEMPORÁRIA (Versão 4). Console de debug para o
 * desenvolvedor. Abre/fecha com a tecla ` (crase) — ou Ctrl+` dentro de um
 * campo de texto — e Esc fecha. Digite `help` para ver os comandos.
 *
 * Para remover: apague a pasta `src/features/debug/` e a linha
 * `<DebugConsole />` em `src/app/App.tsx`.
 */

type OutputLine = { id: number; text: string };

function isTextField(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  const tag = element.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || element.isContentEditable;
}

export function DebugConsole() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<OutputLine[]>([
    { id: 0, text: "Console de debug. Digite 'help'." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lineId = useRef(1);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  // Alterna com a tecla ` (crase). Fora de campos de texto abre direto;
  // dentro de um campo do jogo só abre com Ctrl para não atrapalhar a digitação.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Backquote") {
        const inOtherField =
          isTextField(document.activeElement) && document.activeElement !== inputRef.current;
        if (event.ctrlKey || !inOtherField) {
          event.preventDefault();
          setOpen((previous) => !previous);
        }
        return;
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, []);

  const append = (texts: string[]) => {
    setLines((previous) => {
      const next = [...previous];
      for (const text of texts) {
        next.push({ id: lineId.current++, text });
      }
      return next.slice(-200);
    });
    requestAnimationFrame(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
    });
  };

  const submit = () => {
    const raw = value.trim();
    setValue("");
    if (!raw) {
      return;
    }
    history.current.push(raw);
    historyIndex.current = history.current.length;
    append([`› ${raw}`]);
    const result = runDebugCommand(raw);
    if (result[0] === "__close__") {
      setOpen(false);
      return;
    }
    if (result[0] === "__clear__") {
      setLines([]);
      return;
    }
    append(result);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.current.length === 0) {
        return;
      }
      historyIndex.current = Math.max(0, historyIndex.current - 1);
      setValue(history.current[historyIndex.current] ?? "");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1);
      setValue(history.current[historyIndex.current] ?? "");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      data-testid="debug-console"
      className="fixed inset-x-0 bottom-0 z-[9999] mx-auto max-w-3xl border-t border-emerald-500/40 bg-black/95 p-3 font-mono text-sm text-emerald-300 shadow-2xl"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div className="mb-2 flex items-center justify-between text-emerald-400">
        <span className="font-bold">⚙️ Debug console (temporário) — `help`</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded px-2 text-emerald-300 hover:bg-emerald-500/20"
        >
          ✕
        </button>
      </div>
      <div
        ref={outputRef}
        className="mb-2 max-h-56 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed"
      >
        {lines.map((line) => (
          <div key={line.id}>{line.text}</div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span aria-hidden="true">›</span>
        <input
          ref={inputRef}
          data-testid="debug-input"
          value={value}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="coins 500 · xp 200 · unlockall · help"
          className="flex-1 bg-transparent text-emerald-100 placeholder:text-emerald-700 focus:outline-none"
        />
      </div>
    </div>
  );
}
