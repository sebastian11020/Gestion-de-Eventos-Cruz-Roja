"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Users, Trash2 } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";

export function PrivacyParticipantsSection({
                                               form,
                                               onChange,
                                               selectedVolunteers,
                                               onOpenPicker,
                                               onOpenChangeLeader,
                                               onRemoveVolunteer,
                                           }: {
    form: CreateEventForm;
    onChange: <K extends keyof CreateEventForm>(key: K, value: CreateEventForm[K]) => void;
    selectedVolunteers: { id: string; name: string; document?: string }[];
    onOpenPicker: () => void;
    onOpenChangeLeader: () => void;
    onRemoveVolunteer: (id: string) => void;
}) {
    return (
        <FancyCard title="Privacidad y participantes" icon={<Users className="w-4 h-4" />}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.isPrivate === "true"}
                            onChange={(e) => onChange("isPrivate", e.target.checked ? "true" : "false")}
                        />
                        <span className="text-sm font-medium">Evento privado</span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                            disabled={form.isPrivate !== "true"}
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
                </div>

                {form.isPrivate === "true" && (
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
