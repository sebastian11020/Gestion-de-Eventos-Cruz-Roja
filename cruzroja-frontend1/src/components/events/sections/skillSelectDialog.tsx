"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ReactDOM from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, CheckCircle2 } from "lucide-react";

export function SkillSelectDialog({
  open,
  title = "Elige una habilidad",
  options,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  options: { id: string; name: string }[];
  onCancel: () => void;
  onConfirm: (skillId: string) => void;
}) {
  const [selected, setSelected] = useState<string>("");

  const sorted = useMemo(
    () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
    [options],
  );

  useEffect(() => {
    if (!open) setSelected("");
  }, [open, options]);

  const content = open ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Fondo con blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Contenedor principal */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl border border-gray-200 p-0 animate-[scaleIn_180ms_ease-out]">
        {/* Header sin línea */}
        <div className="flex items-start gap-3 p-4">
          <div className="shrink-0 mt-0.5 rounded-xl bg-blue-50 p-2 text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tienes varias habilidades requeridas por el evento. Selecciona con
              cuál deseas inscribirte.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de habilidades */}
        <div className="px-4 pt-1 pb-3 space-y-2 max-h-64 overflow-auto focus:outline-none">
          {sorted.map((op) => {
            const isActive = selected === op.id;
            return (
              <label
                key={op.id}
                className={[
                  "group flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition-all duration-150",
                  isActive
                    ? "border-blue-300 bg-blue-50/70 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="skill"
                  value={op.id}
                  checked={isActive}
                  onChange={() => setSelected(op.id)}
                  className="h-4 w-4 accent-blue-600"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">{op.name}</span>
                  {isActive && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </label>
            );
          })}

          {!sorted.length && (
            <div className="text-sm text-gray-500 py-2">
              No hay habilidades disponibles.
            </div>
          )}
        </div>

        {/* Footer con botones coloreados */}
        <div className="px-4 pb-5 pt-1 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            className="w-full sm:w-auto rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition font-medium shadow-sm"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </Button>

          <Button
            className={[
              "w-full sm:w-auto rounded-xl font-medium text-white shadow-sm transition",
              selected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed opacity-70",
            ].join(" ")}
            onClick={() => {
              if (!selected) {
                toast.error("Selecciona una habilidad para continuar");
                return;
              }
              onConfirm(selected);
            }}
            type="button"
          >
            Confirmar
          </Button>
        </div>
      </div>

      {/* Animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  ) : null;

  const portalTarget = typeof window !== "undefined" ? document.body : null;
  return portalTarget ? ReactDOM.createPortal(content, portalTarget) : content;
}
