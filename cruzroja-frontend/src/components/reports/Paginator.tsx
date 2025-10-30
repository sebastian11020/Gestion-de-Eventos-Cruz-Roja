"use client";
import { buildPageList } from "@/hooks/usePagination";

export function PaginationBar({
                                  meta,
                                  page,
                                  totalPages,
                                  onPage,
                                  pageSize,
                                  onPageSize,
                              }: {
    meta: { showingFrom: number; showingTo: number; total: number };
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
    pageSize: number;
    onPageSize: (n: number) => void;
}) {
    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <span className="text-xs text-gray-500">
        Mostrando <span className="font-medium text-gray-700">{meta.showingFrom}-{meta.showingTo}</span> de {" "}
          <span className="font-medium text-gray-700">{meta.total}</span>
      </span>

            <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Tamaño:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSize(parseInt(e.target.value, 10))}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800 shadow-sm focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    >
                        {[10, 20, 50, 100].map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </label>

                <button onClick={() => onPage(1)} disabled={page === 1} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50">« Primero</button>
                <button onClick={() => onPage(page - 1)} disabled={page === 1} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50">‹ Anterior</button>

                <div className="flex items-center gap-1">
                    {buildPageList(totalPages, page, 7).map((p, idx) =>
                            p === "..." ? (
                                <span key={`dots-${idx}`} className="select-none px-2 text-xs text-gray-500">
                …
              </span>
                            ) : (
                                <button
                                    key={`p-${p}`}
                                    onClick={() => onPage(p as number)}
                                    aria-current={p === page ? "page" : undefined}
                                    className={[
                                        "min-w-8 rounded-md border px-2 py-1 text-xs shadow-sm transition",
                                        p === page ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
                                    ].join(" ")}
                                >
                                    {p}
                                </button>
                            )
                    )}
                </div>

                <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50">Siguiente ›</button>
                <button onClick={() => onPage(totalPages)} disabled={page === totalPages} className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm enabled:hover:border-gray-400 disabled:opacity-50">Último »</button>
            </div>
        </div>
    );
}
