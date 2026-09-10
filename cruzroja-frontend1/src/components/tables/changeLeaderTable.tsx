"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { leaderDataTable } from "@/types/usertType";
import { normalize } from "@/utils/normalize";
import { PageBtn } from "@/components/buttons/pageButton";
import { changeLeaderSectionalService } from "@/services/serviceCreateSectional";
import toast from "react-hot-toast";
import { changeLeaderGroup } from "@/services/serviceCreateGroups";
import { changeLeaderProgram } from "@/services/serviceCreateProgram";

type ChangeLeaderTableProps = {
  users: leaderDataTable[];
  isChange?: boolean;
  isSectional?: boolean;
  isGroup?: boolean;
  isProgram?: boolean;
  sectional?: string;
  group?: string;
  initialPageSize?: number;
  onSelect?: (document: string, name: string) => void;
  onCancel?: () => void;
  onDeleted?: () => Promise<void> | void;
};

function badgeClass(state: string) {
  const s = (state ?? "").toLowerCase();
  if (s === "activo")
    return "inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200";
  if (s === "licencia")
    return "inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-200";
  if (s === "desvinculado")
    return "inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200";
  if (s === "inactivo")
    return "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200";
  if (s === "formación")
    return "inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200";
  return "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200";
}

export default function ChangeLeaderTable({
  users,
  initialPageSize = 10,
  onSelect,
  sectional,
  group,
  isSectional,
  isProgram,
  isGroup,
  onCancel,
  onDeleted,
  isChange = false,
}: ChangeLeaderTableProps) {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return users;
    return users.filter((u) => normalize(u.name).includes(q));
  }, [users, query]);

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

  async function handleChange(data: {
    idSectional?: string;
    leader: string;
    idGroupHeadquarters?: string;
  }) {
    try {
      if (isSectional) {
        toast.loading("Cambiando lider", { duration: 1000 });
        console.log(data);
        const response = await changeLeaderSectionalService(data);
        if (response.success) {
          toast.success(response.message);
          await onDeleted?.();
        } else {
          toast.error(response.message);
        }
      }
      if (isGroup) {
        toast.loading("Cambiando lider", { duration: 1000 });
        const newData = { ...data, idGroupHeadquarters: group };
        console.log(newData);
        const response = await changeLeaderGroup(newData);
        if (response.success) {
          toast.success(response.message);
          await onDeleted?.();
        } else {
          toast.error(response.message);
        }
      }
      if (isProgram) {
        toast.loading("Cambiando lider", { duration: 1000 });
        const newData = { ...data, idProgramsHeadquarters: group };
        console.log(newData);
        const response = await changeLeaderProgram(newData);
        if (response.success) {
          toast.success(response.message);
          await onDeleted?.();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1); // resetear página cuando se busca
              }}
              className="
                w-full rounded-lg border border-gray-300 bg-white
                pl-10 pr-3 py-2 text-sm text-gray-900
                placeholder:text-gray-400
                shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              "
              aria-label="Buscar persona por nombre"
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

      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> persona
        {total === 1 ? "" : "s"}
      </div>

      {/* Tabla */}
      <div
        className="
          overflow-x-auto rounded-xl border border-gray-200 bg-white
          shadow-[0_6px_24px_-10px_rgba(0,0,0,0.2)]
        "
        aria-label="Listado de personas para cambio de líder"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              {[
                "Tipo de Documento",
                "Documento",
                "Nombre",
                "Estado",
                "Acciones",
              ].map((h) => (
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
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  {total === 0 ? (
                    <>No hay datos para mostrar.</>
                  ) : (
                    <>
                      No se encontraron resultados para{" "}
                      <span className="font-medium text-gray-700">
                        “{query}”
                      </span>
                      .
                    </>
                  )}
                </td>
              </tr>
            ) : (
              paged.map((g, idx) => (
                <tr
                  key={`${g.document}-${idx}`}
                  className={`
                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                    hover:bg-blue-50/40 focus-within:bg-blue-50/40 transition-colors
                  `}
                >
                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2 min-w-[12rem]">
                      <span className="truncate">{g.typeDocument}</span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2 min-w-[10rem]">
                      <span className="font-medium tracking-wide">
                        {g.document}
                      </span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2 min-w-[14rem]">
                      <span className="truncate">{g.name}</span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2 min-w-[10rem]">
                      <span className={badgeClass(g.state)}>{g.state}</span>
                    </div>
                  </td>

                  <td className="border-b border-gray-200 px-4 py-3 text-gray-700">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="
                          inline-flex items-center justify-center rounded-md p-2
                          text-green-700 hover:bg-green-100 hover:text-green-800
                          transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                        "
                        title="Seleccionar"
                        aria-label={`Seleccionar a ${g.name}`}
                        onClick={() => {
                          onSelect?.(g.document, g.name);
                          onCancel?.();
                          if (isChange) {
                            const payload = {
                              idSectional: sectional,
                              leader: g.document,
                            };
                            handleChange(payload);
                          }
                        }}
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
            className="
              inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
              text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
            "
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
            className="
              inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
              text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20
            "
          >
            Siguiente
            <ChevronRight className="size-4" />
          </button>
        </div>
      </nav>
    </section>
  );
}
