import { Button } from "@/components/ui/button";
import type { sectional } from "@/types/sectionalType";
import type { group } from "@/types/usertType";
import { useState } from "react";
import { Crown } from "lucide-react";

export function AssociateGroupForm({
  groups,
  sectionals,
  onOpenLeader,
  onCancel,
  onSubmit,
}: {
  groups: group[];
  sectionals: sectional[];
  onOpenLeader: () => void;
  onCancel: () => void;
  onSubmit: (payload: { idGroup: string; idHeadquarters: string }) => void;
}) {
  const [idGroup, setIdGroup] = useState("");
  const [idHeadquarters, setIdHeadquarters] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ idGroup, idHeadquarters });
      }}
      className="space-y-5"
    >
      <div className="grid gap-1.5">
        <label htmlFor="group" className="text-sm font-medium text-gray-800">
          Agrupación
        </label>
        <select
          id="group"
          required
          value={idGroup}
          onChange={(e) => setIdGroup(e.target.value)}
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
          La agrupación quedará asociada a la sede seleccionada.
        </p>
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="sectional-2"
          className="text-sm font-medium text-gray-800"
        >
          Sede
        </label>
        <select
          id="sectional-2"
          required
          value={idHeadquarters}
          onChange={(e) => setIdHeadquarters(e.target.value)}
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
        <p className="text-xs text-gray-500">
          La agrupación quedará asociada a la sede seleccionada.
        </p>
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
          disabled={!idHeadquarters}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
