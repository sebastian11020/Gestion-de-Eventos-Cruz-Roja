"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { group } from "@/types/usertType";

type GroupTableProps = {
  groups: group[];
  initialPageSize?: number;
};

export default function GroupTable({
  groups,
  initialPageSize = 10,
}: GroupTableProps) {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1); // 1-based

  const normalize = (v: string) =>
    (v ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return groups;
    return groups.filter((g) => normalize(g.name).includes(q));
  }, [groups, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = useMemo(
    () => filtered.slice(start, end),
    [filtered, start, end],
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(maxButtons / 2);
    let from = Math.max(1, page - half);
    let to = Math.min(totalPages, from + maxButtons - 1);
    if (to - from + 1 < maxButtons) from = Math.max(1, to - maxButtons + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [page, totalPages]);

  return (
    <section className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900">Agrupaciones</h2>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar agrupación…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="
                w-full rounded-lg border border-gray-300 bg-white
                pl-10 pr-3 py-2 text-sm text-gray-900
                placeholder:text-gray-400
                shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              "
              aria-label="Buscar agrupación por nombre"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <span>Tamaño pág.</span>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Meta info */}
      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> agrupación
        {total === 1 ? "" : "es"}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-[0_6px_24px_-10px_rgba(0,0,0,0.2)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              {["Nombre", "Líder", "Programas"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-200 px-4 py-3 font-semibold bg-gray-50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 grid place-items-center">
                      <span className="text-gray-400 text-lg">–</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      {total === 0
                        ? "No hay agrupaciones registradas."
                        : `No se encontraron resultados para “${query}”.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((g, idx) => (
                <tr
                  key={g.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                  } hover:bg-blue-50/40 focus-within:bg-blue-50/40 transition-colors`}
                >
                  <td className="border-b border-gray-200 px-4 py-3 text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{g.name}</span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2 min-w-[12rem]">
                      <span className="truncate">{g.leader?.name}</span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex flex-wrap gap-1.5">
                      {g.program.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                          title={p.leader ? `Líder: ${p.leader}` : "Programa"}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {p.name}
                        </span>
                      ))}
                      {g.program.length === 0 && (
                        <span className="text-gray-400 text-xs">
                          Sin programas
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <nav
        className="flex flex-col items-center justify-between gap-3 sm:flex-row"
        aria-label="Paginación"
      >
        <span className="text-xs text-gray-500">
          Página <span className="font-medium">{page}</span> de{" "}
          <span className="font-medium">{totalPages}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </button>

          <div className="mx-1 hidden sm:flex">
            {pageNumbers[0] > 1 && (
              <>
                <PageBtn n={1} current={page} onClick={setPage} />
                <span className="px-1 text-gray-400">…</span>
              </>
            )}
            {pageNumbers.map((n) => (
              <PageBtn key={n} n={n} current={page} onClick={setPage} />
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                <span className="px-1 text-gray-400">…</span>
                <PageBtn n={totalPages} current={page} onClick={setPage} />
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </button>
        </div>
      </nav>
    </section>
  );
}

function getInitials(full?: string) {
  if (!full) return "L";
  const parts = full.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return (first + last).toUpperCase();
}

function PageBtn({
  n,
  current,
  onClick,
}: {
  n: number;
  current: number;
  onClick: (n: number) => void;
}) {
  const active = n === current;
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      aria-current={active ? "page" : undefined}
      className={`mx-0.5 inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {n}
    </button>
  );
}
