"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { GroupCard } from "@/components/cards/groupCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  createGroupService,
  associateGroupService,
} from "@/services/serviceCreateGroups";
import { useGroupsData } from "@/hooks/useGroupsData";
import { usePaginatedSearch } from "@/hooks/usePaginatedSearch";
import { usePageNumbers } from "@/hooks/usedPaginatedNumbers";
import { PAGE_SIZE } from "@/const/consts";
import { normalize } from "@/utils/normalize";
import { PageBtn } from "@/components/buttons/pageButton";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import type { group } from "@/types/usertType";
import { CreateGroupForm } from "@/components/forms/createGroupForm";
import { AssociateGroupForm } from "@/components/forms/associateGroupForm";
import { Loading } from "@/components/ui/loading";
import {usePageTitle} from "@/hooks/usePageTittle";


export default function Agrupaciones() {
  const [open, setOpen] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [documentSelected, setDocumentSelected] = useState<string>("");
  const [nameLeader, setNameLeader] = useState<string>("");
  const { sectionals, groups, catalogGroups, users, loading, reload } =
    useGroupsData();
  const [query, setQuery] = useState("");
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
  } = usePaginatedSearch<group>({
    data: groups,
    query: normalize(query),
    pageSize: PAGE_SIZE,
    filterFn: (g, q) => normalize(g.name).includes(q),
  });

  const pageNumbers = usePageNumbers(page, totalPages);

    usePageTitle("Agrupaciones");

  function openCreate() {
    setIsNewGroup(false);
    setOpen(true);
  }
  function openAssociate() {
    setIsNewGroup(true);
    setOpen(true);
  }

  async function onCreateSubmit(name: string) {
    setOpen(false);
    setQuery("");
    setPage(1);
    await toast.promise(
      createGroupService({ name }).then((res) => {
        if (!res.success) {
          return Promise.reject(res);
        }
        return res;
      }),
      {
        loading: "Creando...",
        success: (res: { message?: string }) => {
          return <b>{res.message ?? "Creado correctamente"}</b>;
        },
        error: (res: { message?: string }) => (
          <b>{res.message ?? "No se pudo crear"}</b>
        ),
      },
    );
    await reload();
  }

  async function onAssociateSubmit(payload: {
    idGroup: string;
    idHeadquarters: string;
  }) {
    const newPayload = { ...payload, leader: documentSelected };
    setOpen(false);
    setQuery("");
    setPage(1);
    await toast.promise(
      associateGroupService(newPayload).then((res) => {
        if (!res.success) {
          return Promise.reject(res);
        }
        return res;
      }),
      {
        loading: "Asociando...",
        success: (res: { message?: string }) => {
          return <b>{res.message ?? "Asociado correctamente"}</b>;
        },
        error: (res: { message?: string }) => (
          <b>{res.message ?? "No se pudo asociado"}</b>
        ),
      },
    );
    await reload();
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center overflow-auto">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Agrupaciones
        </h1>

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por agrupación o seccional…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Buscar agrupación"
            />
          </div>

          <Button
            type="button"
            onClick={openAssociate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Agrupación (Catalogo)
          </Button>

          <Button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Crear Agrupación
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> agrupación
        {total === 1 ? "" : "es"}
      </div>
      {loading ? (
        <Loading size="lg" label="Cargando Agrupaciones" />
      ) : paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay agrupaciones registradas."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((sec) => (
            <GroupCard
              key={`${sec.id}-${sec.sectional}`}
              group={sec}
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
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsNewGroup(false);
        }}
        title="Nueva Agrupación"
      >
        {isNewGroup ? (
          <AssociateGroupForm
            groups={catalogGroups}
            sectionals={sectionals}
            nameLeader={nameLeader}
            onOpenLeader={() => setOpenChangeLeader(true)}
            onCancel={() => {
              setOpen(false);
              setIsNewGroup(false);
            }}
            onSubmit={onAssociateSubmit}
          />
        ) : (
          <CreateGroupForm
            onCancel={() => {
              setOpen(false);
              setIsNewGroup(false);
            }}
            onSubmit={onCreateSubmit}
          />
        )}
      </Modal>
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={"Seleccionar Lider"}
      >
        <ChangeLeaderTable
          users={users}
          onSelect={(document, name) => {
            {
              (setDocumentSelected(document), setNameLeader(name));
            }
          }}
          onCancel={() => setOpenChangeLeader(false)}
        />
      </Modal>
    </div>
  );
}
