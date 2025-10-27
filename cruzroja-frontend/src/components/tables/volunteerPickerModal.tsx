"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check, X, Trash2 } from "lucide-react";
import { Volunteer } from "@/types/usertType";

export default function VolunteerPickerModal({
  open,
  onClose,
  defaultSelected = [],
  volunteer,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  defaultSelected?: Volunteer[];
  volunteer: Volunteer[];
  onSave: (list: Volunteer[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Volunteer[]>([]);
  const [page, setPage] = useState(1);
  const PAGE = 8;

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected, open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return volunteer;
    const q = query.toLowerCase();
    return volunteer.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.document ?? "").toLowerCase().includes(q) ||
        (v.email ?? "").toLowerCase().includes(q),
    );
  }, [volunteer, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, (page - 1) * PAGE + PAGE);

  function toggle(vol: Volunteer) {
    setSelected((prev) => {
      const exists = prev.some((v) => v.id === vol.id);
      if (exists) return prev.filter((v) => v.id !== vol.id);
      return [...prev, vol];
    });
  }
  const isSelected = (id: string) => selected.some((v) => v.id === id);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header degradado */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white">
          <h3 className="text-sm font-semibold">Seleccionar voluntarios</h3>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-1 hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-5 p-5 md:grid-cols-3">
          {/* Resultados (card sin bordes, con sombra ligera) */}
          <div className="md:col-span-2 rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b p-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por nombre, documento o email…"
                  className="w-full rounded-xl border px-8 py-2 text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Tabla moderna: sin bordes, con divide-y y hover */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-3 py-2 font-medium">Nombre</th>
                    <th className="px-3 py-2 font-medium">Documento</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {paged.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60">
                      <td className="px-3 py-2">{u.name}</td>
                      <td className="px-3 py-2">{u.document ?? "-"}</td>
                      <td className="px-3 py-2">{u.email ?? "-"}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => toggle(u)}
                          className="inline-flex items-center rounded-full p-2 transition hover:bg-gray-100"
                          title={isSelected(u.id) ? "Quitar" : "Agregar"}
                          aria-label={isSelected(u.id) ? "Quitar" : "Agregar"}
                        >
                          {isSelected(u.id) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td
                        className="px-3 py-6 text-sm text-gray-600"
                        colSpan={4}
                      >
                        Sin resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación minimal */}
            <div className="flex items-center justify-between p-3">
              <span className="text-xs text-gray-600">
                Mostrando {filtered.length === 0 ? 0 : (page - 1) * PAGE + 1}–
                {Math.min(page * PAGE, filtered.length)} de {filtered.length}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>

          {/* Seleccionados (chips/cards suaves, sin borde) */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between p-3">
              <div className="text-sm font-medium">
                Seleccionados
                <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {selected.length}
                </span>
              </div>
            </div>

            <div className="max-h-[360px] overflow-auto p-3 space-y-2">
              {selected.length === 0 && (
                <div className="text-sm text-gray-600">
                  Aún no has agregado voluntarios.
                </div>
              )}

              {selected.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2 text-sm shadow-sm"
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {u.document ?? "-"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((prev) => prev.filter((v) => v.id !== u.id))
                    }
                    className="ml-2 inline-flex items-center rounded-full p-2 hover:bg-gray-200"
                    title="Quitar"
                    aria-label="Quitar"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer degradado pegajoso */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 rounded-b-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
              <Button
                variant="outline"
                className="rounded-xl"
                type="button"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                type="button"
                onClick={() => onSave(selected)}
              >
                Guardar selección
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
