"use client";
import { PaginationBar } from "@/components/reports/Paginator";
import type { InactiveItem } from "@/app/dashboard/reportes/page";
import type { SelectionApi } from "@/hooks/useSelection";
import type { PaginationApi } from "@/hooks/usePagination";
import { fmtDate } from "@/utils/date";

export function InactiveTable({
  total,
  pageSlice,
  pagination,
  selection,
  notes,
  setNotes,
  onGeneratePdf,
}: {
  total: number;
  pageSlice: InactiveItem[];
  pagination: PaginationApi;
  selection: SelectionApi<InactiveItem>;
  notes: Record<string, string>;
  setNotes: (
    f: (prev: Record<string, string>) => Record<string, string>,
  ) => void;
  onGeneratePdf: () => Promise<void> | void;
}) {
  const allPageSelected =
    pageSlice.length > 0 && pageSlice.every((it) => selection.isSelected(it));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Listado para resolución de desvinculación
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

      {/* Acciones */}
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
            title="Generar y descargar PDF de resolución de desvinculación"
          >
            Generar resolución de desvinculación
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
                <th className="px-4 py-2 font-medium">Fecha inactividad</th>
                <th className="px-4 py-2 font-medium w-[360px]">
                  Observaciones
                </th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No hay datos para mostrar.
                  </td>
                </tr>
              ) : (
                pageSlice.map((it) => {
                  const checked = selection.isSelected(it);
                  return (
                    <tr
                      key={it.document}
                      className={`border-t border-gray-100 hover:bg-gray-50/60 ${checked ? "bg-red-50/50" : ""}`}
                    >
                      <td className="sticky left-0 z-10 bg-white px-4 py-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => selection.toggle(it)}
                          aria-label={`Seleccionar ${it.name}`}
                        />
                      </td>
                      <td className="sticky left-12 z-10 bg-white px-4 py-2 font-medium text-gray-800">
                        {it.document}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{it.license}</td>
                      <td className="px-4 py-2 text-gray-800">{it.name}</td>
                      <td className="px-4 py-2 text-gray-800">
                        {fmtDate(it.Inactivation_date)}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={notes[it.document] ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [it.document]: e.target.value,
                            }))
                          }
                          placeholder="Escribe aquí..."
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
