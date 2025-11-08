"use client";
import { CalendarCheck } from "lucide-react";
import { PaginationBar } from "@/components/reports/Paginator";
import type { Volunteer } from "@/app/dashboard/reportes/page";
import type { SelectionApi } from "@/hooks/useSelection";
import type { PaginationApi } from "@/hooks/usePagination";

export function VolunteersTable({
  loading,
  total,
  pageSlice,
  pagination,
  selection,
  notes,
  setNotes,
  onOpenHours,
  onGeneratePdf,
}: {
  loading: boolean;
  total: number;
  pageSlice: Volunteer[];
  pagination: PaginationApi;
  selection: SelectionApi<Volunteer>;
  notes: Record<string, string>;
  setNotes: (
    f: (prev: Record<string, string>) => Record<string, string>,
  ) => void;
  onOpenHours: (v: Volunteer) => void;
  onGeneratePdf: () => Promise<void> | void;
}) {
  const allPageSelected =
    pageSlice.length > 0 && pageSlice.every((v) => selection.isSelected(v));

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-gray-800 md:text-2xl">
        Reportes
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          Seleccionados:{" "}
          <span className="font-semibold">{selection.count()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGeneratePdf}
            disabled={selection.count() === 0}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
            title="Generar y descargar PDF de inactividad (agrupado por programa)"
          >
            Generar reporte de inactividad
          </button>
          <button
            onClick={selection.clear}
            disabled={selection.count() === 0}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm disabled:opacity-40"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 shadow-sm">
        {/* encabezado */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Listado de voluntarios
          </h2>
          <PaginationBar
            meta={{
              showingFrom: pagination.showingFrom,
              showingTo: pagination.showingTo,
              total,
            }}
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPage={pagination.goTo}
            pageSize={pagination.pageSize}
            onPageSize={pagination.setPageSize}
          />
        </div>

        {/* tabla */}
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={() => selection.toggleMany(pageSlice)}
                    aria-label="Seleccionar todos en esta página"
                  />
                </th>
                <th className="sticky left-12 z-10 bg-gray-50 px-4 py-2 font-medium">
                  Documento
                </th>
                <th className="px-4 py-2 font-medium">Carnet</th>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium w-[360px]">
                  Observaciones
                </th>
                <th className="px-4 py-2 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Cargando…
                  </td>
                </tr>
              ) : pageSlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                pageSlice.map((v) => {
                  const checked = selection.isSelected(v);
                  return (
                    <tr
                      key={v.document}
                      className={`border-t border-gray-100 hover:bg-gray-50/60 ${checked ? "bg-red-50/50" : ""}`}
                    >
                      <td className="sticky left-0 z-10 bg-white px-4 py-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => selection.toggle(v)}
                          aria-label={`Seleccionar ${v.name}`}
                        />
                      </td>
                      <td className="sticky left-12 z-10 bg-white px-4 py-2 font-medium text-gray-800">
                        {v.document}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {(v as any).licence ?? (v as any).license ?? ""}
                      </td>
                      <td className="px-4 py-2 text-gray-800">{v.name}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={notes[v.document] ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [v.document]: e.target.value,
                            }))
                          }
                          placeholder="Escribe aquí..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => onOpenHours(v)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Ver reporte de horas"
                        >
                          <CalendarCheck className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* footer paginación */}
        <div className="border-t border-gray-200 px-4 py-3">
          <PaginationBar
            meta={{
              showingFrom: pagination.showingFrom,
              showingTo: pagination.showingTo,
              total,
            }}
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPage={pagination.goTo}
            pageSize={pagination.pageSize}
            onPageSize={pagination.setPageSize}
          />
        </div>
      </div>
    </section>
  );
}
