import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import type { createProgram } from "@/types/usertType";
import type {
  SectionalNode,
  GroupNode,
  ProgramItem,
} from "@/types/programType";

type LocalForm = {
  sectional: string;
  group: string;
  programId: string;
};

export function AssociateProgramForm({
  sectionals,
  onOpenLeader,
  onCancel,
  onSubmit,
}: {
  sectionals: SectionalNode[];
  onOpenLeader: () => void;
  onCancel: () => void;
  onSubmit: (payload: createProgram) => void;
}) {
  const [form, setForm] = useState<LocalForm>({
    sectional: "",
    group: "",
    programId: "",
  });

  const sectionalSelected = useMemo(
    () =>
      sectionals.find((c) => String(c.id) === String(form.sectional)) || null,
    [sectionals, form.sectional],
  );
  const groupOptions: GroupNode[] = sectionalSelected?.groups ?? [];

  const groupSelected = useMemo(
    () => groupOptions.find((g) => String(g.id) === String(form.group)) || null,
    [groupOptions, form.group],
  );
  const programOptions: ProgramItem[] = groupSelected?.program ?? [];

  const canSave = Boolean(form.sectional && form.group && form.programId);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload: createProgram = {
          idHeadquarters: form.sectional ?? "",
          idProgram: form.programId ?? "",
        };
        onSubmit(payload);
      }}
      className="space-y-5"
    >
      {/* Seccional */}
      <div className="grid gap-1.5">
        <label
          htmlFor="sectionalCat"
          className="text-sm font-medium text-gray-800"
        >
          Sede
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
            Selecciona una sede…
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
        <label htmlFor="groupCat" className="text-sm font-medium text-gray-800">
          Agrupación
        </label>
        <select
          id="groupCat"
          required
          disabled={!form.sectional}
          value={form.group}
          onChange={(e) =>
            setForm((f) => ({ ...f, group: e.target.value, programId: "" }))
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

      {/* Programa */}
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

      <Button
        type="button"
        variant="outline"
        onClick={onOpenLeader}
        className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99]"
      >
        <Crown className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
        Seleccionar Líder
      </Button>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!canSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
