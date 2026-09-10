"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Field } from "@/components/layout/field";
import { ListChecks } from "lucide-react";
import type { CreateEventForm, SkillQuota } from "@/types/usertType";
import { useMemo, useState } from "react";

export const BASE_SKILL_ID = "3";
type SkillOption = { id: string; name: string };

export function OperationSection({
                                   form,
                                   onChange,
                                   skills,
                                 }: {
  form: CreateEventForm;
  onChange: <K extends keyof CreateEventForm>(
      key: K,
      value: CreateEventForm[K],
  ) => void;
  skills: SkillOption[];
}) {
  const capacity = Number.isFinite(form.capacity) ? form.capacity : 0;
  const requiresSkills = !!form.requiresSkills;
  const quotas = form.skillsQuotasList ?? [];

  // Excluimos la "habilidad" Base (id === BASE_SKILL_ID) de la lista editable,
  // ya que se representa aparte como la fila "Base (voluntarios sin habilidad)".
  const realSkills = useMemo(
      () => skills.filter((s) => s.id !== BASE_SKILL_ID),
      [skills],
  );

  // Estado local para permitir que el input quede vacío mientras se edita,
  // sin que un onChange lo "snapee" de inmediato a 0.
  const [editingValues, setEditingValues] = useState<Record<string, string>>(
      {},
  );

  // helpers array
  const getQty = (id: string) => quotas.find((q) => q.id === id)?.qty ?? 0;

  const commitQty = (id: string, nextRaw: string) => {
    const parsed =
        nextRaw === "" ? 0 : Math.max(0, Math.floor(Number(nextRaw) || 0));
    const assignedWithoutThis = quotas.reduce(
        (sum, q) =>
            q.id === id ? sum : sum + (Number.isFinite(q.qty) ? q.qty : 0),
        0,
    );
    const maxAllowed = Math.max(0, capacity - assignedWithoutThis);
    const next = Math.min(parsed, maxAllowed);

    // upsert en el array evitando duplicados
    const nextList: SkillQuota[] = (() => {
      const exists = quotas.some((q) => q.id === id);
      if (exists) {
        return quotas.map((q) => (q.id === id ? { ...q, qty: next } : q));
      }
      return [...quotas, { id, qty: next }];
    })();

    onChange("skillsQuotasList", nextList);
    return next;
  };

  // Mientras el usuario escribe, solo actualizamos el texto local (permite vacío).
  const handleQtyChange = (id: string, raw: string) => {
    // Solo dígitos (o vacío) para que el campo se comporte como numérico.
    if (raw !== "" && !/^\d+$/.test(raw)) return;
    setEditingValues((prev) => ({ ...prev, [id]: raw }));
  };

  // Al perder el foco, se confirma y clampa el valor definitivo.
  const handleQtyBlur = (id: string, raw: string) => {
    commitQty(id, raw);
    setEditingValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // suma asignada SOLO de habilidades reales (no BASE)
  const totalAssigned = useMemo(() => {
    const idsReales = new Set(realSkills.map((s) => s.id));
    return quotas
        .filter((q) => idsReales.has(q.id))
        .reduce((a, b) => a + (Number.isFinite(b.qty) ? b.qty : 0), 0);
  }, [quotas, realSkills]);

  const baseRemaining = Math.max(0, capacity - totalAssigned);
  const overCapacity = totalAssigned > capacity;

  function toggleRequiresSkills(next: boolean) {
    onChange("requiresSkills", next);
    if (!next) onChange("skillsQuotasList", []); // limpieza si lo apagan
  }

  return (
      <FancyCard title="Operación" icon={<ListChecks className="w-4 h-4" />}>
        {/* Capacidad + toggles */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Capacidad">
            <input
                type="number"
                required
                min={0}
                value={Number.isFinite(form.capacity) ? form.capacity : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  const next = v === "" ? Number.NaN : Math.max(0, Number(v));
                  onChange("capacity", next);
                }}
                onBlur={() =>
                    onChange(
                        "capacity",
                        Number.isFinite(form.capacity) ? Math.max(0, form.capacity) : 0,
                    )
                }
                className="w-28 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </Field>

          <label className="flex items-center gap-3 pt-6">
            <input
                type="checkbox"
                checked={form.isVirtual}
                disabled={form.applyDecreet}
                onChange={(e) => {
                  const checked = e.target.checked;
                  onChange("isVirtual", checked);
                  onChange("applyDecreet", checked ? false : form.applyDecreet);
                }}
            />
            <span className="text-sm">Virtual</span>
          </label>

          <label className="flex items-center gap-2 pt-6">
            <input
                type="checkbox"
                checked={form.isAdult}
                onChange={(e) => onChange("isAdult", e.target.checked)}
            />
            <span className="text-sm">¿Se requiere mayoría de edad?</span>
          </label>

          <label className="flex items-center gap-2 pt-6">
            <input
                type="checkbox"
                checked={form.applyDecreet}
                disabled={form.isVirtual}
                onChange={(e) => {
                  const checked = e.target.checked;
                  onChange("applyDecreet", checked);
                  onChange("isVirtual", checked ? false : form.isVirtual);
                }}
            />
            <span className="text-sm">Aplica decreto 1809</span>
          </label>
        </div>

        {/* Requiere habilidades */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={requiresSkills}
                onChange={(e) => toggleRequiresSkills(e.target.checked)}
                disabled={capacity <= 0}
            />
            <span className="text-sm">¿Requiere habilidades?</span>
          </label>

          <div className="text-sm text-right">
            <span className="font-medium">Asignado:</span> {totalAssigned} /{" "}
            {capacity}{" "}
            {overCapacity && (
                <span className="ml-2 text-red-600">Se excede la capacidad</span>
            )}
          </div>
        </div>

        {/* Cuotas por habilidad + Base */}
        {requiresSkills && (
            <div className="mt-3 rounded-xl border border-gray-200 p-3">
              <div className="grid gap-3">
                {realSkills.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No hay habilidades configuradas.
                    </div>
                )}

                {realSkills.map((sk) => {
                  const current = getQty(sk.id);
                  const assignedWithoutThis = totalAssigned - current;
                  const maxAllowed = Math.max(0, capacity - assignedWithoutThis);
                  const displayValue = editingValues[sk.id] ?? String(current);

                  return (
                      <div
                          key={sk.id}
                          className="flex items-center justify-between gap-4"
                      >
                        <div className="text-sm">{sk.name}</div>
                        <div className="flex items-center gap-2">
                          <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              min={0}
                              max={maxAllowed}
                              value={displayValue}
                              disabled={capacity <= 0}
                              onChange={(e) => handleQtyChange(sk.id, e.target.value)}
                              onBlur={(e) => handleQtyBlur(sk.id, e.target.value)}
                              className="w-24 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <span className="text-xs text-gray-500">
                      máx. {maxAllowed}
                    </span>
                        </div>
                      </div>
                  );
                })}

                {/* Fila "Base" (solo lectura) */}
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium">
                    Base (voluntarios sin habilidad)
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                        type="number"
                        readOnly
                        disabled
                        value={baseRemaining}
                        className="w-24 rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm text-right"
                    />
                    <span className="text-xs text-gray-500">auto</span>
                  </div>
                </div>
              </div>
            </div>
        )}
      </FancyCard>
  );
}