"use client";
import { useEffect, useMemo, useState } from "react";
import type {createGroup, group} from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { GroupCard } from "@/components/layout/groupCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {getSectionalService} from "@/services/serviceGetSectional";
import {associateGroupService, createGroupService,} from "@/services/serviceCreateGroups";
import {getGroup, getGroupService} from "@/services/serviceGetGroup";


type sectional = { id: string; city: string };
type groups = { id: string; name: string };


type FormState = {
  idGroup?:string;
  name: string;
  sectional: string;
};

const PAGE_SIZE = 8;
const normalize = (v: string) =>
  (v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function Agrupaciones() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ idGroup:"",name: "", sectional: "" });
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [sectionals,setSectionals] = useState<sectional[]>([])
  const [groups,setGroups] = useState<group[]>([])
    const [groupsData,setGroupsData] = useState<group[]>([])

    useEffect(() => {
        getGroups();
        getSectionals();
    },[groupsData] );

    async function getGroups(){
        try {
            const groupsData: groups[] = await getGroupService();
            const allGroups: groups[] = await getGroup();
            setGroups(allGroups);
            setGroupsData(groupsData);
        }catch (error){
            console.error(error)
        }
    }
    async function getSectionals(){
        try {
            const sectionalsData: sectional[] = await getSectionalService();
            setSectionals(sectionalsData);
        }catch (error){
            console.error(error)
        }
    }

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1); // 1-based

  const sectionalSelected = useMemo(
    () => sectionals.find((c) => c.id === form.sectional) || null,
    [form.sectional],
  );

    const groupSelected = useMemo(
        () => groups.find((c) => c.id === form.sectional) || null,
        [form.sectional],
    );

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return groupsData;
    return groupsData.filter(
      (g) =>
        normalize(g.name).includes(q) ||
        normalize(g.sectional ?? "").includes(q),
    );
  }, [groupsData, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const paged = useMemo(
    () => filtered.slice(start, end),
    [filtered, start, end],
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(maxButtons / 2);
    let from = Math.max(1, page - half);
    let to = Math.min(totalPages, from + maxButtons - 1);
    if (to - from + 1 < maxButtons) from = Math.max(1, to - maxButtons + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [page, totalPages]);

  function resetForm() {
    setForm({ name: "", sectional: "" });
  }
  function isNewGroupForm() {
    setIsNewGroup(true);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    setIsNewGroup(true);
    e.preventDefault();
    const newItem: createGroup = {
        name: groupSelected?.id ?? '',
        idHeadquarters: sectionalSelected?.id ?? '',
    };
    setOpen(false);
    resetForm();
    setQuery("");
    setPage(1);
    console.log(newItem)
    const response = await createGroupService(newItem)
      if(response.success){
          console.log("Agrupación Creada")
      }
  }

    async function handleAssociate(e: React.FormEvent) {
        setIsNewGroup(true);
        e.preventDefault();
        const newItem: createGroup = {
            idGroup: form.idGroup,
            idHeadquarters: sectionalSelected?.id ?? '',
        };
        setOpen(false);
        resetForm();
        setQuery("");
        setPage(1);
        console.log(newItem)
        const response = await associateGroupService(newItem)
        if(response.success){
            console.log("Agrupación Asociada")
        }
    }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Agrupaciones
        </h1>

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          {/* Search */}
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
              className="
                w-full rounded-lg border border-gray-300 bg-white
                pl-10 pr-3 py-2 text-sm text-gray-900
                placeholder:text-gray-400
                shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              "
              aria-label="Buscar agrupación"
            />
          </div>

          {/* Botones */}
          <Button
            type="button"
            onClick={() => isNewGroupForm()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Agrupación (Catalogo)
          </Button>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Crear Agrupación
          </Button>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> agrupación
        {total === 1 ? "" : "es"}
      </div>

      {/* Grid paginado */}
      {paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay agrupaciones registradas."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((sec) => (
            <GroupCard key={sec.id} group={sec} />
          ))}
        </div>
      )}

      {/* Paginación */}
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

      {/* Modal: crear manual */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsNewGroup(false);
        }}
        title="Nueva Agrupación"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <label
              htmlFor="groupName"
              className="text-sm font-medium text-gray-800"
            >
              Nombre de la agrupación
            </label>
            <input
              id="groupName"
              type="text"
              required
              minLength={2}
              maxLength={60}
              autoFocus
              autoComplete="off"
              placeholder="Ej. Juventud"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onBlur={(e) =>
                setForm((f) => ({ ...f, name: e.target.value.trim() }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-gray-500">
              Usa un nombre claro y corto (2–60 caracteres).
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setOpen(false);
                setIsNewGroup(false);
              }}
              className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!form.name.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: seleccionar de catálogo (si lo usas) */}
      {isNewGroup && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setIsNewGroup(false);
          }}
          title="Nueva Agrupación"
        >
          <form onSubmit={handleAssociate} className="space-y-5">
            <div className="grid gap-1.5">
              <label
                htmlFor="group"
                className="text-sm font-medium text-gray-800"
              >
                Agrupación
              </label>
              <select
                id="group"
                required
                value={form.idGroup}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idGroup: e.target.value }))
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Selecciona una agrupación…
                </option>
                {groups.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                La agrupación quedará asociada a la seccional seleccionada.
              </p>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="sectional-2"
                className="text-sm font-medium text-gray-800"
              >
                Seccional
              </label>
              <select
                id="sectional-2"
                required
                value={form.sectional}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sectional: e.target.value }))
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  Selecciona una seccional…
                </option>
                {sectionals.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.city}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                La agrupación quedará asociada a la seccional seleccionada.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                  setIsNewGroup(false);
                }}
                className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.sectional}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
              >
                Guardar
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
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
