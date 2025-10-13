"use client";
import { useState } from "react";
import { createProgram, program } from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "@/components/cards/programCard";
import {
  associateProgramService,
  createProgramService,
} from "@/services/serviceCreateProgram";
import toast from "react-hot-toast";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import { useProgramsData } from "@/hooks/useProgramsData";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { usePageNumbers } from "@/hooks/usedPaginatedNumbers";
import { normalize } from "@/utils/normalize";
import { PAGE_SIZE } from "@/const/consts";
import { PageBtn } from "@/components/buttons/pageButton";
import { CreateProgramForm } from "@/components/forms/createProgramForm";
import { AssociateProgramForm } from "@/components/forms/associateProgramForm";

export default function Programas() {
  const [open, setOpen] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [isNewProgram, setIsNewProgram] = useState(false);
  const [query, setQuery] = useState("");
  const { items, sectionals,users, loading, reload } = useProgramsData();
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
  } = usePaginatedSearch<program>({
    data: items,
    query: normalize(query),
    pageSize: PAGE_SIZE,
    filterFn: (g, q) => normalize(g.name).includes(q),
  });

  const pageNumbers = usePageNumbers(page, totalPages);

  function openAssociate() {
    setIsNewProgram(true);
    setOpen(true);
  }
  function openCreate() {
    setIsNewProgram(false);
    setOpen(true);
  }

  async function handleCreateManual(payload: createProgram) {
    setOpen(false);
    setQuery("");
    setPage(1);
    toast.loading("Creando Programa", { duration: 1000 });

    const response = await createProgramService(payload);
    if (response.success) {
      toast.success("Programa Creado Correctamente", { duration: 3000 });
      await reload();
    } else {
      toast.error(response.message, { duration: 3000 });
    }
  }
  async function handleAssociateCatalog(payload: createProgram) {
    const newPayload = {...payload,leader:documentSelected}
    console.log(newPayload)
    setOpen(false);
    setQuery("");
    setPage(1);
    toast.loading("Asociando Programa", { duration: 1000 });
    const response = await associateProgramService(newPayload);
    if (response.success) {
      toast.success("Programa Asociado Correctamente", { duration: 3000 });
       await reload();
    } else {
      toast.error(response.message, { duration: 3000 });
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Programas
        </h1>

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar programa…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Buscar programa"
            />
          </div>

          {/* Botones */}
          <Button
            type="button"
            onClick={openAssociate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Programa (catálogo)
          </Button>

          <Button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Crear Programa
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> programa
        {total === 1 ? "" : "s"}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          Cargando…
        </div>
      ) : paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay programas registrados."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((sec) => (
            <ProgramCard key={sec.id} program={sec} users={users} />
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

      {/* Modal único con contenido variable */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsNewProgram(false);
        }}
        title={isNewProgram ? "Agregar Programa (catálogo)" : "Nuevo Programa"}
      >
        {isNewProgram ? (
          <AssociateProgramForm
            sectionals={sectionals}
            nameLeader={nameLeader}
            onOpenLeader={() => setOpenChangeLeader(true)}
            onCancel={() => {
              setOpen(false);
              setIsNewProgram(false);
            }}
            onSubmit={handleAssociateCatalog}
          />
        ) : (
          <CreateProgramForm
            sectionals={sectionals}
            onCancel={() => {
              setOpen(false);
            }}
            onSubmit={handleCreateManual}
          />
        )}
      </Modal>

      {/* Modal: Seleccionar líder */}
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={"Seleccionar Lider"}
      >
        <ChangeLeaderTable users={users} onSelect={(document,name)=>{{setDocumentSelected(document),setNameLeader(name)}}} onCancel={()=>setOpenChangeLeader(false)} />
      </Modal>
    </div>
  );
}
