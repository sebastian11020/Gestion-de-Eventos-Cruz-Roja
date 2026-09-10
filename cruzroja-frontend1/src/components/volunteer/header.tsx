"use client";
import { X } from "lucide-react";
export function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Nuevo voluntario
        </h3>
        <p className="text-xm text-gray-500">
          Los campos marcados con * son obligatorios
        </p>
      </div>
      <button
        onClick={onClose}
        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
        aria-label="Cerrar"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
