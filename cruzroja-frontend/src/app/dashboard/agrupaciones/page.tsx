"use client";
import { useMemo, useState } from "react";
import type { group } from "@/types/usertType";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { GroupCard } from "@/components/layout/groupCard";

type sectional = { id: string; city: string };
type groups = { id: string; name: string };
const SECTIONALS: sectional[] = [
  { id: "1", city: "Tunja" },
  { id: "2", city: "Duitama" },
  { id: "3", city: "Sogamoso" },
];
const GROUPS: groups[] = [
  { id: "1", name: "Juventud" },
  { id: "2", name: "Damas Grices" },
  { id: "3", name: "Socorrismo" },
];

const initialGroups: group[] = [
  {
    id: "1",
    name: "Damas Grices",
    sectional: "Tunja",
    numberVolunteers: "40",
    numberPrograms: "8",
    leader: { document: "1006576543", name: "Juan Sebastian Rodriguez Mateus" },
  },
  {
    id: "2",
    name: "Socorrismo",
    sectional: "Duitama",
    numberVolunteers: "20",
    numberPrograms: "5",
    leader: { document: "1007749746", name: "Sebastian Daza Delgadillo" },
  },
  {
    id: "3",
    name: "Juventud",
    sectional: "Paipa",
    numberVolunteers: "10",
    numberPrograms: "10",
  },
];

type FormState = {
  name: string;
  sectional: string;
};

export default function Agrupaciones() {
  const [items, setItems] = useState<group[]>(initialGroups);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", sectional: "" });
  const [isNewGroup, setIsNewGroup] = useState(false);

  const sectionalSelected = useMemo(
    () => SECTIONALS.find((c) => c.id === form.sectional) || null,
    [form.sectional],
  );

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
    const newItem: group = {
      name: form.name,
      sectional: sectionalSelected?.id,
    };

    setItems((prev) => [newItem, ...prev]);
    setOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Agrupaciones
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            onClick={() => isNewGroupForm()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition"
          >
            + Agregar Agrupación
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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((sec) => (
          <GroupCard key={sec.id} group={sec} />
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsNewGroup(false);
        }}
        title="Nueva Agrupación"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre de la agrupación */}
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
              className="
        rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
        text-gray-900 shadow-sm placeholder:text-gray-400
        focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
      "
            />
            <p className="text-xs text-gray-500">
              Usa un nombre claro y corto (2–60 caracteres).
            </p>
          </div>

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
                setForm((f) => ({ ...f, sectional: e.target.value }))
              }
              className="
        rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
        text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
      "
            >
              <option value="" disabled>
                Selecciona una seccional…
              </option>
              {SECTIONALS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              La agrupación quedará asociada a la seccional seleccionada.
            </p>
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
              disabled={!form.name.trim() || !form.sectional}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
      {isNewGroup && (
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setIsNewGroup(false);
          }}
          title="Nueva Agrupación"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre de la agrupación */}
            <div className="grid gap-1.5">
              <label
                htmlFor="group"
                className="text-sm font-medium text-gray-800"
              >
                Agrupacion
              </label>
              <select
                id="group"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="
        rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
        text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
      "
              >
                <option value="" disabled>
                  Selecciona una agrupación…
                </option>
                {GROUPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                La agrupación quedará asociada a la seccional seleccionada.
              </p>
            </div>

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
                  setForm((f) => ({ ...f, sectional: e.target.value }))
                }
                className="
        rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
        text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none
        focus:ring-2 focus:ring-blue-500/20
      "
              >
                <option value="" disabled>
                  Selecciona una seccional…
                </option>
                {SECTIONALS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.city}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                La agrupación quedará asociada a la seccional seleccionada.
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
                onClick={() => {
                  resetForm();
                  setOpen(false);
                  setIsNewGroup(false);
                }}
                disabled={!form.name.trim() || !form.sectional}
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
