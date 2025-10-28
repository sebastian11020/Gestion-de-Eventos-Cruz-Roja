"use client";
import { useState } from "react";
import { SectionalCard } from "@/components/cards/sectionalCard";
import { createSectional, sectional } from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { createSectionalService } from "@/services/serviceCreateSectional";
import toast from "react-hot-toast";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import { PAGE_SIZE } from "@/const/consts";
import { normalize } from "@/utils/normalize";
import { useSedesData } from "@/hooks/useSedesData";
import { usePageNumbers } from "@/hooks/usedPaginatedNumbers";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { PageBtn } from "@/components/buttons/pageButton";
import { CreateSectionalForm } from "@/components/forms/createSectionalForm";
import { Loading } from "@/components/ui/loading";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";

export default function Sedes() {
  const [open, setOpen] = useState(false);
  const { cities, sectionals, users, loading, reload } = useSedesData();
  const { skills } = useSectionalsNode();
  const [query, setQuery] = useState("");
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [documentSelected, setDocumentSelected] = useState<string>("");
  const [nameLeader, setNameLeader] = useState<string>("");
  const {
    page,
    setPage,
    paged,
    total,
    totalPages,
    start,
    end,
    canPrev,
    canNext,
  } = usePaginatedSearch<sectional>({
    data: sectionals,
    query: normalize(query),
    pageSize: PAGE_SIZE,
    filterFn: (s, q) => normalize(s.city).includes(q),
  });

  const pageNumbers = usePageNumbers(page, totalPages);

  async function handleCreate(payload: createSectional) {
    setOpen(false);
    setQuery("");
    setPage(1);
    const newPayload = { ...payload, leader: documentSelected };
    await toast.promise(
      createSectionalService(newPayload).then((res) => {
        if (!res.success) {
          return Promise.reject(res);
        }
        return res;
      }),
      {
        loading: "Guardando...",
        success: (res: { message?: string }) => {
          setOpen(false);
          setQuery("");
          setPage(1);
          return <b>{res.message ?? "Creado correctamente"}</b>;
        },
        error: (res: { message?: string }) => (
          <b>{res.message ?? "No se pudo crear"}</b>
        ),
      },
    );
    await reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Sedes
        </h1>

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ciudad…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Buscar sede por ciudad"
            />
          </div>

          {/* Add */}
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Sede
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> sede
        {total === 1 ? "" : "s"}
      </div>
      {loading ? (
        <Loading size="lg" label="Cargando Sedes" />
      ) : paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay sedes registradas."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((sec) => (
            <SectionalCard
              key={sec.id}
              sectional={sec}
              users={users}
              onDeleted={reload}
            />
          ))}
        </div>
      )}
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
      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Sede">
        <CreateSectionalForm
          cities={cities}
          nameLeader={nameLeader}
          onOpenLeader={() => setOpenChangeLeader(true)}
          onCancel={() => setOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={"Seleccionar Lider"}
      >
        <ChangeLeaderTable
          users={users}
          onSelect={(document, name) => {
            (setDocumentSelected(document), setNameLeader(name));
          }}
          onCancel={() => setOpenChangeLeader(false)}
        />
      </Modal>
    </div>
  );
}
