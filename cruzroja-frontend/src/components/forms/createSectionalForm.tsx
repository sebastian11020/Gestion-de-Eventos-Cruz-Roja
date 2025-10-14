import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import type { City, FormState } from "@/types/sedesType";
import type { createSectional } from "@/types/usertType";
import { SECTIONAL_TYPES } from "@/const/consts";

export function CreateSectionalForm({
  cities,
  nameLeader,
  onOpenLeader,
  onCancel,
  onSubmit,
}: {
  cities: City[];
  nameLeader: string;
  onOpenLeader: () => void;
  onCancel: () => void;
  onSubmit: (payload: createSectional) => void;
}) {
  const [form, setForm] = useState<FormState>({ cityId: "", type: "" });
  const citySelected = useMemo(
    () => cities.find((c) => c.id === form.cityId) ?? null,
    [cities, form.cityId],
  );
  const canSave = Boolean(form.cityId && form.type);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload: createSectional = {
          idLocation: citySelected?.id ?? "",
          type: form.type,
        };
        onSubmit(payload);
      }}
      className="space-y-5"
    >
      <div className="grid gap-1.5">
        <label htmlFor="cityId" className="text-sm font-medium text-gray-800">
          Ubicación (Ciudad)
        </label>
        <select
          id="cityId"
          required
          value={form.cityId}
          onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="" disabled>
            Selecciona una ciudad…
          </option>
          {cities.map((c) => (
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

      <Button
        type="button"
        variant="outline"
        onClick={onOpenLeader}
        className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800
             shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.99]"
      >
        <Crown className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
        Seleccionar Líder
      </Button>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        <span className="font-medium text-gray-700">Vista previa:</span>{" "}
        {form.type || "—"} en{" "}
        {citySelected
          ? `${citySelected.name} (${nameLeader})`
          : "—"}
      </div>

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
