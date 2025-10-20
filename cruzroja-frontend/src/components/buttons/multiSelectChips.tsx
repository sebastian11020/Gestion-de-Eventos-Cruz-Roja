"use client";
import * as React from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type MultiOption = { id: string; name: string };

export function MultiSelectChips({
  options = [],
  value = [],
  onChange,
  placeholder = "Seleccionar…",
  disabled,
  className,
}: {
  options?: MultiOption[];
  value?: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Siempre trabaja con un arreglo “seguro”
  const safeValue = Array.isArray(value) ? value : [];

  const baseId = React.useMemo(
    () => options.find((o) => o.name.toLowerCase() === "base")?.id ?? "3",
    [options],
  );

  // Garantiza que "base" siempre esté seleccionado
  React.useEffect(() => {
    if (!safeValue.includes(baseId)) {
      onChange([...safeValue, baseId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseId]); // evitar re-ejecutar por cada cambio de value

  const selected = React.useMemo(
    () => options.filter((o) => safeValue.includes(o.id)),
    [options, safeValue],
  );

  const remaining = React.useMemo(
    () => options.filter((o) => !safeValue.includes(o.id)),
    [options, safeValue],
  );

  const remove = (id: string) => {
    if (id === baseId) return; // no quitar "base"
    onChange(safeValue.filter((v) => v !== id));
  };

  const add = (id: string) => {
    if (!safeValue.includes(id)) onChange([...safeValue, id]);
  };

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={cn("w-full relative", className)}>
      {/* Chips */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <span className="text-xs text-gray-500">
            No hay habilidades seleccionadas
          </span>
        ) : (
          selected.map((o) => (
            <span
              key={o.id}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
                o.id === baseId
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800",
              )}
              aria-label={o.name}
            >
              {o.name}
              {o.id !== baseId && (
                <button
                  type="button"
                  onClick={() => remove(o.id)}
                  className="rounded-full hover:opacity-80 focus:outline-none"
                  aria-label={`Quitar ${o.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-88 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm",
          "hover:bg-gray-50 focus:outline-none",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        aria-expanded={open}
      >
        <span className="truncate">
          {selected.length > 0
            ? `${selected.length} seleccionada${selected.length > 1 ? "s" : ""}`
            : placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-60" />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-80 rounded-md border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          <ul className="max-h-56 overflow-auto py-1 text-sm list-none">
            {remaining.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">
                Ya seleccionaste todas
              </li>
            ) : (
              remaining.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => add(o.id)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
                    {o.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
