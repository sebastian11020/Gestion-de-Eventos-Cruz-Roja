// components/event/CreateEventForm.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Users,
    X,
    CalendarClock,
    MapPin,
    Building2,
    ListChecks,
    Layers3,
    Landmark,
    UserRound,
    Phone,
    Trash2
} from "lucide-react";
import VolunteerPickerModal from "@/components/layout/volunteerPickerModal";

type Props = { onCancel: () => void; onSuccess: () => void };

type CreateEventForm = {
    ambit: string;
    classification: string;
    applyDecreet: boolean;
    marcActivity: string;
    startDate: string;
    endDate: string;
    name: string;
    description: string;
    department: string;
    city: string;
    sectionalId: string;
    groupId: string;
    attendant: { name: string; phone: string };
    capacity: string;
    isVirtual: boolean;
    latitud: string;
    longitud: string;
    isPrivate: "true" | "false";
    participants?: string[];
};

const AMBITS = [
    { value: "INSTITUCIONAL", label: "Institucional" },
    { value: "COMUNITARIO", label: "Comunitario" },
    { value: "EDUCATIVO", label: "Educativo" },
];

const CLASSIFICATIONS = [
    { value: "CAPACITACION", label: "Capacitación" },
    { value: "JORNADA", label: "Jornada" },
    { value: "SIMULACRO", label: "Simulacro" },
];

const MARCOS = [
    { value: "SALUD", label: "Salud" },
    { value: "SOCORRISMO", label: "Socorrismo" },
    { value: "JUVENTUD", label: "Juventud" },
];

const SECTIONALS = [
    { id: "sec-tunja", name: "Seccional Tunja", groups: [
            { id: "g-juventud", name: "Juventud" },
            { id: "g-socorrismo", name: "Socorrismo" },
            { id: "g-damas", name: "Damas Grises" },
        ]},
    { id: "sec-duitama", name: "Seccional Duitama", groups: [
            { id: "g-juventud-d", name: "Juventud" },
            { id: "g-socorrismo-d", name: "Socorrismo" },
        ]},
];

const MUNICIPIOS = [
    { id: "tunja", name: "Tunja" },
    { id: "duitama", name: "Duitama" },
    { id: "sogamoso", name: "Sogamoso" },
];

/** Pequeño wrapper para inputs con icono a la izquierda */
function Field({
                   label,
                   icon,
                   children,
                   hint,
               }: {
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-800">{label}</label>
            <div className={`mt-1 flex items-center rounded-2xl border bg-white px-3 ${icon ? "pl-2" : ""} focus-within:ring-2 focus-within:ring-blue-500/20`}>
                {icon && <span className="pr-2 text-gray-400">{icon}</span>}
                <div className="flex-1">{children}</div>
            </div>
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}

/** Card con borde degradado sutil */
function FancyCard({
                       title,
                       icon,
                       children,
                   }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-100 via-white to-indigo-100 shadow-sm">
            <div className="rounded-3xl bg-white">
                <div className="flex items-center gap-2 rounded-t-3xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                    <span className="text-blue-600">{icon}</span>
                    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="px-4 py-4">{children}</div>
            </div>
        </div>
    );
}

export default function CreateEventForm({ onCancel, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [openPicker, setOpenPicker] = useState(false);
    const [selectedVolunteers, setSelectedVolunteers] = useState<
        { id: string; name: string; document?: string }[]
    >([]);

    const [form, setForm] = useState<CreateEventForm>({
        ambit: "",
        classification: "",
        applyDecreet: false,
        marcActivity: "",
        startDate: "",
        endDate: "",
        name: "",
        description: "",
        department: "Boyacá",
        city: "",
        sectionalId: "",
        groupId: "",
        attendant: { name: "", phone: "" },
        capacity: "",
        isVirtual: false,
        latitud: "",
        longitud: "",
        isPrivate: "false",
    });

    const groupsForSectional = useMemo(() => {
        const sec = SECTIONALS.find((s) => s.id === form.sectionalId);
        return sec?.groups ?? [];
    }, [form.sectionalId]);

    const handleSectionalChange = (value: string) => {
        setForm((f) => ({ ...f, sectionalId: value, groupId: "" }));
    };

    function removeVolunteer(id: string) {
        setSelectedVolunteers((prev) => prev.filter((v) => v.id !== id));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.name) return;

        const payload: CreateEventForm = {
            ...form,
            participants: form.isPrivate === "true" ? selectedVolunteers.map(v => v.id) : [],
        };

        setLoading(true);
        try {
            // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            onSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-gray-800">Crear evento</h2>
            </div>

            {/* Info básica */}
            <FancyCard title="Información básica" icon={<ListChecks className="w-4 h-4" />}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Field label="Nombre del evento">
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                                placeholder="Ej. Capacitación en Primeros Auxilios"
                            />
                        </Field>
                    </div>

                    <Field label="Fecha inicio" icon={<CalendarClock className="w-4 h-4" />}>
                        <input
                            type="datetime-local"
                            required
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                        />
                    </Field>

                    <Field label="Fecha fin" icon={<CalendarClock className="w-4 h-4" />}>
                        <input
                            type="datetime-local"
                            required
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                        />
                    </Field>

                    <div className="sm:col-span-2">
                        <Field label="Descripción">
              <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                  rows={3}
                  placeholder="Cuéntanos de qué trata el evento…"
              />
                        </Field>
                    </div>
                </div>
            </FancyCard>

            {/* Clasificación */}
            <FancyCard title="Clasificación del evento" icon={<Layers3 className="w-4 h-4" />}>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Ámbito">
                        <select
                            required
                            value={form.ambit}
                            onChange={(e) => setForm({ ...form, ambit: e.target.value })}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                        >
                            <option value="">Seleccione…</option>
                            {AMBITS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>

                    <Field label="Clasificación">
                        <select
                            required
                            value={form.classification}
                            onChange={(e) => setForm({ ...form, classification: e.target.value })}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                        >
                            <option value="">Seleccione…</option>
                            {CLASSIFICATIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>

                    <Field label="Marco">
                        <select
                            required
                            value={form.marcActivity}
                            onChange={(e) => setForm({ ...form, marcActivity: e.target.value })}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                        >
                            <option value="">Seleccione…</option>
                            {MARCOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </Field>
                </div>
            </FancyCard>

            {/* Ubicación */}
            <FancyCard title="Ubicación y seccional" icon={<MapPin className="w-4 h-4" />}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Departamento" icon={<Landmark className="w-4 h-4" />}>
                        <input
                            type="text"
                            value={form.department}
                            readOnly
                            className="w-full rounded-2xl bg-gray-100 px-2 py-2 text-sm focus:outline-none"
                        />
                    </Field>

                    <Field label="Municipio" icon={<Building2 className="w-4 h-4" />}>
                        <select
                            required
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                        >
                            <option value="">Seleccione…</option>
                            {MUNICIPIOS.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
                        </select>
                    </Field>

                    <Field label="Seccional">
                        <select
                            required
                            value={form.sectionalId}
                            onChange={(e) => handleSectionalChange(e.target.value)}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                        >
                            <option value="">Seleccione…</option>
                            {SECTIONALS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </Field>

                    <Field label="Agrupación">
                        <select
                            required
                            disabled={!form.sectionalId}
                            value={form.groupId}
                            onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none disabled:bg-gray-100"
                        >
                            <option value="">{form.sectionalId ? "Seleccione…" : "Elija seccional"}</option>
                            {groupsForSectional.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </Field>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Latitud">
                        <input
                            type="text"
                            value={form.latitud}
                            onChange={(e) => setForm({ ...form, latitud: e.target.value })}
                            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                            placeholder="Ej. 5.5353"
                        />
                    </Field>
                    <Field label="Longitud">
                        <input
                            type="text"
                            value={form.longitud}
                            onChange={(e) => setForm({ ...form, longitud: e.target.value })}
                            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                            placeholder="-73.3678"
                        />
                    </Field>
                </div>
            </FancyCard>

            {/* Operación */}
            <FancyCard title="Operación" icon={<ListChecks className="w-4 h-4" />}>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Capacidad">
                        <input
                            type="number"
                            min={0}
                            value={form.capacity}
                            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                        />
                    </Field>

                    <label className="flex items-center gap-2 pt-6">
                        <input
                            type="checkbox"
                            checked={form.isVirtual}
                            onChange={(e) => setForm({ ...form, isVirtual: e.target.checked })}
                        />
                        <span className="text-sm">Virtual</span>
                    </label>

                    <label className="flex items-center gap-2 pt-6">
                        <input
                            type="checkbox"
                            checked={form.applyDecreet}
                            onChange={(e) => setForm({ ...form, applyDecreet: e.target.checked })}
                        />
                        <span className="text-sm">Aplica decreto 1809</span>
                    </label>
                </div>
            </FancyCard>

            {/* Privado / Participantes */}
            <FancyCard title="Privacidad y participantes" icon={<Users className="w-4 h-4" />}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isPrivate === "true"}
                                onChange={(e) => setForm({ ...form, isPrivate: e.target.checked ? "true" : "false" })}
                            />
                            <span className="text-sm font-medium">Evento privado</span>
                        </label>

                        <Button
                            type="button"
                            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            disabled={form.isPrivate !== "true"}
                            onClick={() => setOpenPicker(true)}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Gestionar participantes
                        </Button>
                    </div>

                    {form.isPrivate === "true" && (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-700">
                                {selectedVolunteers.length === 0
                                    ? "No hay participantes agregados."
                                    : `Participantes: ${selectedVolunteers.length}`}
                            </div>

                            {selectedVolunteers.length > 0 && (
                                <div className="overflow-x-auto rounded-2xl ">
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
                                            <tr key={u.id} className="">
                                                <td className="px-3 py-2">{u.name}</td>
                                                <td className="px-3 py-2">{u.document ?? "-"}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVolunteer(u.id)}
                                                        className="inline-flex items-center rounded-xl  px-2 py-1 text-xs hover:bg-gray-50"
                                                        title="Quitar"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 hover:bg-gray-100" />
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

            {/* Footer acciones */}
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    disabled={loading}
                >
                    {loading ? "Creando..." : "Crear evento"}
                </Button>
            </div>

            {/* Modal selector */}
            <VolunteerPickerModal
                open={openPicker}
                onClose={() => setOpenPicker(false)}
                defaultSelected={selectedVolunteers}
                onSave={(list) => {
                    setSelectedVolunteers(list);
                    setOpenPicker(false);
                }}
            />
        </form>
    );
}
