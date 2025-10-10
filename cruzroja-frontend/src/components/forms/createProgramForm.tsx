import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { createProgram } from "@/types/usertType";
import type { SectionalNode, GroupNode } from "@/types/programType";

type LocalForm = {
    sectional: string;
    group: string;
    name: string;
};

export function CreateProgramForm({
                                      sectionals,
                                      onCancel,
                                      onSubmit,
                                  }: {
    sectionals: SectionalNode[];
    onCancel: () => void;
    onSubmit: (payload: createProgram) => void;
}) {
    const [form, setForm] = useState<LocalForm>({
        name: "",
        sectional: "",
        group: "",
    });

    const sectionalSelected = useMemo(
        () => sectionals.find((c) => String(c.id) === String(form.sectional)) || null,
        [sectionals, form.sectional]
    );
    const groupOptions: GroupNode[] = sectionalSelected?.groups ?? [];

    const canSave = Boolean(form.sectional && form.group && form.name.trim());

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const payload: createProgram = {
                    name: form.name.trim(),
                    id_group: form.group ?? "",
                };
                onSubmit(payload);
            }}
            className="space-y-5"
        >
            {/* Seccional */}
            <div className="grid gap-1.5">
                <label htmlFor="sectional" className="text-sm font-medium text-gray-800">
                    Sede
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
                <label htmlFor="group" className="text-sm font-medium text-gray-800">
                    Agrupación
                </label>
                <select
                    id="group"
                    required
                    disabled={!form.sectional}
                    value={form.group}
                    onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                >
                    <option value="" disabled>
                        {form.sectional ? "Selecciona una agrupación…" : "Primero elige una seccional"}
                    </option>
                    {groupOptions.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nombre del programa */}
            <div className="grid gap-1.5">
                <label htmlFor="programName" className="text-sm font-medium text-gray-800">
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
                    onBlur={(e) => setForm((f) => ({ ...f, name: e.target.value.trim() }))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                />
            </div>

            {/* Acciones */}
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
