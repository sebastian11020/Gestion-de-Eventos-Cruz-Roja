"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Users, Trash2 } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";

export function PrivacyParticipantsSection({
  form,
  onChange,
  selectedVolunteers,
  leader,
  onOpenPicker,
  onOpenChangeLeader,
  onRemoveVolunteer,
}: {
  form: CreateEventForm;
  onChange: <K extends keyof CreateEventForm>(
    key: K,
    value: CreateEventForm[K],
  ) => void;
  selectedVolunteers: { id: string; name: string; document?: string }[];
  onOpenPicker: () => void;
  onOpenChangeLeader: () => void;
  leader: string;
  onRemoveVolunteer: (id: string) => void;
}) {
  const hasLeader = typeof leader === "string" && leader.trim().length > 0;

  return (
    <FancyCard
      title="Privacidad y participantes"
      icon={<Users className="w-4 h-4" />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) => onChange("isPrivate", e.target.checked)}
            />
            <span className="text-sm font-medium">Evento privado</span>
          </label>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                disabled={!form.isPrivate}
                onClick={onOpenPicker}
              >
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gestionar participantes
                </span>
              </button>

              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white hover:from-blue-700 hover:to-indigo-700"
                onClick={onOpenChangeLeader}
              >
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Seleccionar encargado
                </span>
              </button>
            </div>

            {/* Encargado seleccionado (debajo de “Seleccionar encargado”) */}
            <div className="w-full text-right">
              <div className="text-xs text-gray-500">Encargado</div>
              <div className="mt-1">
                {hasLeader ? (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                               bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                    aria-live="polite"
                  >
                    {leader}
                  </span>
                ) : (
                  <span
                    className="text-sm text-gray-500 italic"
                    aria-live="polite"
                  >
                    No hay ningún encargado asignado.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {form.isPrivate && (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              {selectedVolunteers.length === 0
                ? "No hay participantes agregados."
                : `Participantes: ${selectedVolunteers.length}`}
            </div>

            {selectedVolunteers.length > 0 && (
              <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-left">Documento</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVolunteers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-3 py-2">{u.name}</td>
                        <td className="px-3 py-2">{u.document ?? "-"}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => onRemoveVolunteer(u.id)}
                            className="inline-flex items-center rounded-xl px-2 py-1 text-xs hover:bg-gray-50"
                            title="Quitar"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </FancyCard>
  );
}
