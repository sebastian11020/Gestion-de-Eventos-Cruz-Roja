"use client";
import { useMemo, useState, useEffect } from "react";
import { CalendarCheck } from "lucide-react";
import { HoursModal } from "@/components/reports/HoursModal";
import { groupReport } from "@/types/reportType";
import { usePersonData } from "@/hooks/usePersonData";

type Volunteer = groupReport["groups"][number]["volunteers"][number];

function buildPageList(totalPages: number, current: number, maxButtons = 7) {
    if (totalPages <= maxButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [];
    const side = Math.floor((maxButtons - 3) / 2);
    const left = Math.max(2, current - side);
    const right = Math.min(totalPages - 1, current + side);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
}

export default function Reportes() {
    const { groups, loading } = usePersonData();

    const [notes, setNotes] = useState<Record<string, string>>({});
    const [openHoursFor, setOpenHoursFor] = useState<Volunteer | null>(null);

    // Filas a partir de groups normalizados del hook
    const rows: Volunteer[] = useMemo(
        () => (groups ?? []).flatMap((g) => g.volunteers ?? []),
        [groups]
    );

    // 🔢 Paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // opciones: 10/20/50/100

    // Resetear página cuando cambian los datos o el pageSize
    useEffect(() => {
        setPage(1);
    }, [groups, pageSize]);

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const pageSlice = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        const end = start + pageSize;
        return rows.slice(start, end);
    }, [rows, safePage, pageSize]);

    const showingFrom = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const showingTo = Math.min(safePage * pageSize, total);

    function goTo(p: number) {
        setPage(Math.min(Math.max(1, p), totalPages));
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="mb-4 text-xl font-bold tracking-tight text-gray-800 md:text-2xl">
                Reportes
            </h1>

            <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 shadow-sm">
                {/* Encabezado */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Listado de voluntarios
                    </h2>

                    <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Mostrando{" "}
                <span className="font-medium text-gray-700">
                {showingFrom}-{showingTo}
              </span>{" "}
                de <span className="font-medium text-gray-700">{total}</span>
            </span>

                        <label className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Tamaño:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    const size = parseInt(e.target.value, 10);
                                    setPageSize(size);
                                }}
                                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800 shadow-sm focus:border-red-600 focus:ring-2 focus:ring-red-200"
                            >
                                {[10, 20, 50, 100].map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="sticky left-0 z-10 bg-gray-50 px-4 py-2 font-medium">
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
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                                    Cargando…
                                </td>
                            </tr>
                        ) : pageSlice.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        ) : (
                            pageSlice.map((v) => (
                                <tr
                                    key={v.document}
                                    className="border-t border-gray-100 hover:bg-gray-50/60"
                                >
                                    {/* Documento (sticky para mejorar lectura) */}
                                    <td className="sticky left-0 z-10 bg-white px-4 py-2 font-medium text-gray-800">
                                        {v.document}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700">{v.license}</td>
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
                                            onClick={() => setOpenHoursFor(v)}
                                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                            title="Ver reporte de horas"
                                        >
                                            <CalendarCheck className="size-4" />
                                            Ver reporte de horas
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Footer: Paginación con números */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            Página{" "}
              <span className="font-medium text-gray-700">{safePage}</span> de{" "}
              <span className="font-medium text-gray-700">{totalPages}</span>
          </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goTo(1)}
                            disabled={safePage === 1}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50"
                        >
                            « Primero
                        </button>
                        <button
                            onClick={() => goTo(safePage - 1)}
                            disabled={safePage === 1}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50"
                        >
                            ‹ Anterior
                        </button>

                        {/* Botones numerados */}
                        <div className="flex items-center gap-1">
                            {buildPageList(totalPages, safePage, 7).map((p, idx) =>
                                    p === "..." ? (
                                        <span
                                            key={`dots-${idx}`}
                                            className="select-none px-2 text-xs text-gray-500"
                                        >
                    …
                  </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goTo(p as number)}
                                            aria-current={p === safePage ? "page" : undefined}
                                            className={[
                                                "min-w-8 rounded-md border px-2 py-1 text-xs shadow-sm transition",
                                                p === safePage
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                                            ].join(" ")}
                                        >
                                            {p}
                                        </button>
                                    )
                            )}
                        </div>

                        <button
                            onClick={() => goTo(safePage + 1)}
                            disabled={safePage === totalPages}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50"
                        >
                            Siguiente ›
                        </button>
                        <button
                            onClick={() => goTo(totalPages)}
                            disabled={safePage === totalPages}
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50"
                        >
                            Último »
                        </button>
                    </div>
                </div>
            </div>
            <HoursModal volunteer={openHoursFor} onClose={() => setOpenHoursFor(null)} />
        </div>
    );
}
