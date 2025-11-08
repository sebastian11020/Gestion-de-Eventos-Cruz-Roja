"use client";

import { Button } from "@/components/ui/button";
import { History, PlusCircle, Loader2, ScanLine } from "lucide-react";

export function EventsToolbar({
  loading,
  showHistory,
  onToggleHistory,
  onOpenCreate,
  isCreate,
  onOpenQrReader,
}: {
  loading: boolean;
  isCreate: boolean;
  showHistory: boolean;
  onToggleHistory: () => void;
  onOpenCreate: () => void;
  onOpenQrReader: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
        Eventos
      </h1>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onOpenQrReader}
          disabled={loading}
          className="
            flex items-center gap-2 rounded-xl
            bg-indigo-600 text-white font-medium
            hover:bg-indigo-700 hover:shadow-md
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
          "
          title="Leer QR para registrar asistencia"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ScanLine className="w-4 h-4" />
          )}
          Leer QR
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onToggleHistory}
          disabled={loading}
          className="
            flex items-center gap-2 rounded-xl border-2
            border-gray-300 text-gray-700 font-medium
            hover:bg-gray-100 hover:text-blue-700 hover:border-blue-400
            active:scale-[0.97]
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <History className="w-4 h-4" />
          )}
          {showHistory ? "Ver próximos" : "Ver historial"}
        </Button>

        {isCreate && (
          <Button
            type="button"
            onClick={onOpenCreate}
            disabled={loading}
            className="
            flex items-center gap-2 rounded-xl
            bg-blue-600 text-white font-medium
            hover:bg-blue-700 hover:shadow-md
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            Crear evento
          </Button>
        )}
      </div>
    </div>
  );
}
