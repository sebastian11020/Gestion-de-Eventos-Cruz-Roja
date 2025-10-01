"use client";
import { useEffect, useMemo, useState } from "react";
import { SectionalCard } from "@/components/layout/sectionalCard";
import type { createSectional, sectional } from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getCities } from "@/services/serviceSelect";
import { createSectionalService } from "@/services/serviceCreateSectional";
import { getSectionalService } from "@/services/serviceGetSectional";
import toast from "react-hot-toast";

const SECTIONAL_TYPES = [
  "SEDE SECCIONAL",
  "UNIDAD MUNICIPAL",
  "GRUPO DE APOYO",
] as const;

type City = { id: string; name: string; department: string };

type FormState = {
  cityId: string;
  type: (typeof SECTIONAL_TYPES)[number] | "";
};

const PAGE_SIZE = 8;

const normalize = (v: string) =>
  (v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function Sedes() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ cityId: "", type: "" });
  const [cities, setCities] = useState<City[]>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sectionals, setSectionals] = useState<sectional[]>([]);
  const citySelected: City | null = useMemo(
    (): City | null => cities?.find((c) => c.id === form.cityId) || null,
    [form.cityId],
  );

  useEffect(() => {
    getMunicipalities();
    getSectionals();
  }, [sectionals]);

  async function getMunicipalities() {
    try {
      const citiesForm: City[] = await getCities();
      setCities(citiesForm);
    } catch (error) {
      console.error(error);
    }
  }

  async function getSectionals() {
    try {
      const sectionalsData: sectional[] = await getSectionalService();
      setSectionals(sectionalsData);
    } catch (error) {
      console.error(error);
    }
  }

  const filtered = useMemo(() => {
    const base = sectionals ?? [];
    const q = normalize(query);
    if (!q) return base;
    return base.filter((s) => normalize(s.city).includes(q));
  }, [sectionals, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const paged = useMemo(
    () => filtered?.slice(start, end),
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
    setForm({ cityId: "", type: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newItem: createSectional = {
      idLocation: citySelected?.id ?? "",
      type: form.type,
    };
    console.log(newItem);
    setOpen(false);
    resetForm();
    setQuery("");
    setPage(1);
    toast.loading("Creando sede",{duration:1000})
    const response = await createSectionalService(newItem);
    if (response.success) {
      toast.success("Sede creada correctamente")
    }else {
        toast.error("No se ha podido crear la sede")
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Sedes
        </h1>

        <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
          {/* Search */}
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
              className="
                w-full rounded-lg border border-gray-300 bg-white
                pl-10 pr-3 py-2 text-sm text-gray-900
                placeholder:text-gray-400
                shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              "
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

      {/* Grid (paginado) */}
      {paged.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          {total === 0
            ? "No hay sedes registradas."
            : `No se encontraron resultados para “${query}”.`}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paged!.map((sec) => (
            <SectionalCard key={sec.id} sectional={sec} />
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

      {/* Modal crear */}
      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Sede">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-1.5">
            <label
              htmlFor="cityId"
              className="text-sm font-medium text-gray-800"
            >
              Ubicación (Ciudad)
            </label>
            <select
              id="cityId"
              required
              value={form.cityId}
              onChange={(e) =>
                setForm((f) => ({ ...f, cityId: e.target.value }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="" disabled>
                Selecciona una ciudad…
              </option>
              {cities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="type" className="text-sm font-medium text-gray-800">
              Tipo de sede
            </label>
            <select
              id="type"
              required
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value as FormState["type"],
                }))
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="" disabled>
                Selecciona el tipo…
              </option>
              {SECTIONAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <span className="font-medium text-gray-700">Vista previa:</span>{" "}
            {form.type ? form.type : "—"} en{" "}
            {citySelected
              ? `${citySelected.name} (${citySelected.department})`
              : "—"}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!form.cityId || !form.type}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
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
