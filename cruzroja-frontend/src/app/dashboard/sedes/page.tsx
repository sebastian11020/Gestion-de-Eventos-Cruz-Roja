"use client";
import { useMemo, useState } from "react";
import { SectionalCard } from "@/components/layout/sectionalCard";
import type { sectional } from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";

const SECTIONAL_TYPES = [
  "Sede Seccional",
  "Unidad Municipal",
  "Unidad de Apoyo",
];
type City = { id: string; name: string; department: string };
const CITIES: City[] = [
  { id: "1", name: "Tunja", department: "Boyacá" },
  { id: "2", name: "Duitama", department: "Boyacá" },
  { id: "3", name: "Sogamoso", department: "Boyacá" },
];

const initialSectionals: sectional[] = [
  {
    id: "1",
    city: "Tunja",
    type: "Sede Seccional",
    numberVolunteers: "40",
    numberGroups: "4",
    leader: { document: "1006576543", name: "Juan Sebastian Rodriguez Mateus" },
  },
  {
    id: "2",
    city: "Duitama",
    type: "Unidad Municipal",
    numberVolunteers: "20",
    numberGroups: "3",
    leader: { document: "1007749746", name: "Sebastian Daza Delgadillo" },
  },
  {
    id: "3",
    city: "Paipa",
    type: "Unidad de Apoyo",
    numberVolunteers: "10",
    numberGroups: "3",
  },
];

type FormState = {
  cityId: string;
  type: (typeof SECTIONAL_TYPES)[number] | "";
};

export default function Sedes() {
  const [items, setItems] = useState<sectional[]>(initialSectionals);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ cityId: "", type: "" });

  const citySelected = useMemo(
    () => CITIES.find((c) => c.id === form.cityId) || null,
    [form.cityId],
  );

  function resetForm() {
    setForm({ cityId: "", type: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newItem: sectional = {
      id: String(Date.now()),
      city: citySelected?.name ?? "",
      type: form.type,
    };

    setItems((prev) => [newItem, ...prev]);
    setOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Sedes
        </h1>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
        >
          + Agregar Sede
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((sec) => (
          <SectionalCard key={sec.id} sectional={sec} />
        ))}
      </div>

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
              className="
                rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none
                focus:ring-2 focus:ring-blue-500/20
              "
            >
              <option value="" disabled>
                Selecciona una ciudad…
              </option>
              {CITIES.map((c) => (
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
              className="
                rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none
                focus:ring-2 focus:ring-blue-500/20
              "
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

          {/* Resumen rápido */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <span className="font-medium text-gray-700">Vista previa:</span>{" "}
            {form.type ? form.type : "—"} en{" "}
            {citySelected
              ? `${citySelected.name} (${citySelected.department})`
              : "—"}
          </div>

          {/* Acciones */}
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
