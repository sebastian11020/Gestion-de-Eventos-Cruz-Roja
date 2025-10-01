"use client";
import { useEffect, useMemo, useState } from "react";
import type {createProgram, program} from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "@/components/layout/programCard";
import {getSectionalInfo} from "@/services/serviceCreateSectional";
import {createProgramService} from "@/services/serviceCreateProgram";

type ProgramItem = { id: string; name: string };
type GroupNode = { id: string; name: string; program: ProgramItem[] };
type SectionalNode = { id: string; city: string; groups: GroupNode[] };


const initialPrograms: program[] = [
  {
    id: "1",
    name: "Busqueda y Rescate",
    sectional: "Tunja",
    group: "Socorrismo",
    numberVolunteers: "40",
    leader: { document: "1006576543", name: "Juan Sebastian Rodriguez Mateus" },
  },
  {
    id: "2",
    name: "Aire Libre",
    sectional: "Duitama",
    group: "Juventud",
    numberVolunteers: "20",
    leader: { document: "1007749746", name: "Sebastian Daza Delgadillo" },
  },
];

type FormState = {
  sectional: string;
  group: string;
  name: string;
  programId?: string;
};

const PAGE_SIZE = 8;
const normalize = (v: string) =>
  (v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function Agrupaciones() {
  const [items, setItems] = useState<program[]>(initialPrograms);
  const [open, setOpen] = useState(false);
  const [sectionals, setSectionals] = useState<SectionalNode[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    sectional: "",
    group: "",
    programId: "",
  });
  const [isNewProgram, setIsNewProgram] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1); // 1-based

  async function getSectionals(){
    try {
      const sectionalsData: SectionalNode[] = await getSectionalInfo();
      console.log(sectionalsData);
      setSectionals(sectionalsData);
    }catch (error){
      console.error(error)
    }
  }
    const sectionalSelected = useMemo(
        () => sectionals.find((c) => String(c.id) === String(form.sectional)) || null,
        [form.sectional, sectionals] // 👈 importante
    );
    const groupOptions: GroupNode[] = sectionalSelected?.groups ?? [];

    const groupSelected = useMemo(
        () => groupOptions.find((g) => String(g.id) === String(form.group)) || null,
        [groupOptions, form.group]
    );
    const programOptions: ProgramItem[] = groupSelected?.program ?? [];

  // filtra (por nombre de programa)
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((p) => normalize(p.name).includes(q));
  }, [items, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    useEffect(() => {
        getSectionals();
    }, []);

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
    setForm({ name: "", sectional: "", group: "", programId: "" });
  }
  function isNewGroupForm() {
    setIsNewProgram(true);
    setOpen(true);
  }

  async function handleSubmitManual(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sectional || !form.group || !form.name.trim()) return;

    const newItem: createProgram = {
      name: form.name.trim(),
      id_group: form.group ?? "",
    };
    setOpen(false);
    resetForm();
    setQuery("");
    setPage(1);
    const response = await createProgramService(newItem);

    if (response.success){
      console.log("Programa Creado")
    }
  }

  // Crear desde catálogo (elige seccional + grupo + programa existente)
  function handleSubmitCatalog(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sectional || !form.group || !form.programId) return;

    const selectedProgram = programOptions.find((p) => p.id === form.programId);
    if (!selectedProgram) return;

    const newItem: program = {
      id: String(Date.now()),
      name: selectedProgram.name,
      sectional: sectionalSelected?.city ?? "",
      group: groupSelected?.name ?? "",
    };

    setItems((prev) => [newItem, ...prev]);
    setOpen(false);
    resetForm();
    setQuery("");
    setPage(1);
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
            onClick={() => isNewGroupForm()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Programa (catálogo)
          </Button>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Crear Programa
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="font-medium">
          {total === 0 ? 0 : start + 1}–{end}
        </span>{" "}
        de <span className="font-medium">{total}</span> programa
        {total === 1 ? "" : "s"}
      </div>

      {paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay programas registrados."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged.map((sec) => (
            <ProgramCard key={sec.id} program={sec} />
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

      {/* Modal: crear manual (seccional -> agrupación -> nombre programa) */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsNewProgram(false);
        }}
        title="Nuevo Programa"
      >
        <form onSubmit={handleSubmitManual} className="space-y-5">
          {/* Seccional */}
          <div className="grid gap-1.5">
            <label
              htmlFor="sectional"
              className="text-sm font-medium text-gray-800"
            >
              Seccional
            </label>
            <select
              id="sectional"
              required
              value={form.sectional}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  sectional: e.target.value,
                  group: "",
                  programId: "",
                }))
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
          </div>

          {/* Agrupación (depende de Seccional) */}
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
              disabled={!form.sectional}
              value={form.group}
              onChange={(e) =>
                setForm((f) => ({ ...f, group: e.target.value}))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            >
              <option value="" disabled>
                {form.sectional
                  ? "Selecciona una agrupación…"
                  : "Primero elige una seccional"}
              </option>
              {groupOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre del programa (manual) */}
          <div className="grid gap-1.5">
            <label
              htmlFor="programName"
              className="text-sm font-medium text-gray-800"
            >
              Nombre del programa
            </label>
            <input
              id="programName"
              type="text"
              required
              minLength={2}
              maxLength={60}
              disabled={!form.group}
              placeholder="Ej. Aire Libre"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onBlur={(e) =>
                setForm((f) => ({ ...f, name: e.target.value.trim() }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setOpen(false);
                setIsNewProgram(false);
              }}
              className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!form.sectional || !form.group || !form.name.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: seleccionar de catálogo (Seccional -> Agrupación -> Programa) */}
      {isNewProgram && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setIsNewProgram(false);
          }}
          title="Agregar Programa (catálogo)"
        >
          <form onSubmit={handleSubmitCatalog} className="space-y-5">
            {/* Seccional */}
            <div className="grid gap-1.5">
              <label
                htmlFor="sectionalCat"
                className="text-sm font-medium text-gray-800"
              >
                Seccional
              </label>
              <select
                id="sectionalCat"
                required
                value={form.sectional}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sectional: e.target.value,
                    group: "",
                    programId: "",
                  }))
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
            </div>

            {/* Agrupación */}
            <div className="grid gap-1.5">
              <label
                htmlFor="groupCat"
                className="text-sm font-medium text-gray-800"
              >
                Agrupación
              </label>
              <select
                id="groupCat"
                required
                disabled={!form.sectional}
                value={form.group}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    group: e.target.value,
                    programId: "",
                  }))
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              >
                <option value="" disabled>
                  {form.sectional
                    ? "Selecciona una agrupación…"
                    : "Primero elige una seccional"}
                </option>
                {groupOptions.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Programa (depende de Agrupación) */}
            <div className="grid gap-1.5">
              <label
                htmlFor="programCat"
                className="text-sm font-medium text-gray-800"
              >
                Programa
              </label>
              <select
                id="programCat"
                required
                disabled={!form.group}
                value={form.programId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, programId: e.target.value }))
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
              >
                <option value="" disabled>
                  {form.group
                    ? "Selecciona un programa…"
                    : "Primero elige una agrupación"}
                </option>
                {programOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                  setIsNewProgram(false);
                }}
                className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.sectional || !form.group || !form.programId}
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
