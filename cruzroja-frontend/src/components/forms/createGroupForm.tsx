import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateGroupForm({
  onCancel,
  onSubmit,
  defaultValue = "",
}: {
  onCancel: () => void;
  onSubmit: (name: string) => void;
  defaultValue?: string;
}) {
  const [name, setName] = useState(defaultValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name.trim());
      }}
      className="space-y-5"
    >
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => setName(e.target.value.trim())}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <p className="text-xs text-gray-500">
          Usa un nombre claro y corto (2–60 caracteres).
        </p>
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
          disabled={!name.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
        >
          Guardar
        </Button>
      </div>
    </form>
  );
}
