"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/layout/modal";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, UserRoundCog, CalendarClock, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";
import { updateEventService } from "@/services/serviceGetEvent";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import type { leaderDataTable } from "@/types/usertType";
import {Department} from "@/types/sedesType";
import {cities} from "@/components/volunteer/constants";
import {useEventQr} from "@/hooks/useEventQr";
import {useEventData} from "@/hooks/useEventData";

type SkillOption = { id: string; name: string };
type SkillQuota = { id: string; name?: string; quantity: number };

type EditEventValues = {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    department: string;
    city: string;
    capacity: string;
    streetAddress: string;
    attendant: string;
    skill_quota: SkillQuota[];
};

function toDatetimeLocal(value?: string | Date) {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditEventDialog({
                                    open,
                                    onClose,
                                    eventId,
                                    initial,
                                    skills,
                                    users,
                                    initialLeaderName = "",
                                    onUpdated,
                                    disabled,
                                }: {
    open: boolean;
    onClose: () => void;
    eventId: string;
    initial: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        department:string;
        city: string;
        capacity: string;
        streetAddress: string;
        attendant: string;
        skill_quota: SkillQuota[];
    };
    skills: SkillOption[];
    users: leaderDataTable[];
    initialLeaderName?: string;
    onUpdated?: () => Promise<void> | void;
    disabled?: boolean;
}) {
    const normalizedInitial: EditEventValues = useMemo(
        () => ({
            title: initial.title ?? "",
            description: initial.description ?? "",
            startDate: toDatetimeLocal(initial.startDate),
            endDate: toDatetimeLocal(initial.endDate),
            city: String(initial.city ?? ""),
            department: String(initial.department ?? ""),
            capacity: String(initial.capacity ?? ""),
            streetAddress: initial.streetAddress ?? "",
            attendant: String(initial.attendant ?? ""),
            skill_quota:
                Array.isArray(initial.skill_quota) && initial.skill_quota.length
                    ? initial.skill_quota.map((sq) => ({
                        id: String(sq.id),
                        name: sq.name,
                        quantity: Number.isFinite(Number(sq.quantity)) ? Number(sq.quantity) : 0,
                    }))
                    : [],
        }),
        [initial],
    );

    const [form, setForm] = useState<EditEventValues>(normalizedInitial);
    const [saving, setSaving] = useState(false);
    const [leaderModalOpen, setLeaderModalOpen] = useState(false);
    const [leaderName, setLeaderName] = useState(initialLeaderName);
    const {departments} = useEventData();
    const departmentSelected = useMemo(
        ()=>
            departments.find((d)=>d.id === form.department) || null,
        [departments,form.department],
    )
    const citiesOptions: cities[] = departmentSelected?.children ?? []

    useEffect(() => {
        if (open) {
            setForm(normalizedInitial);
            setLeaderName(initialLeaderName);
        }
    }, [open, normalizedInitial, initialLeaderName]);

    function onChange<K extends keyof EditEventValues>(k: K, v: EditEventValues[K]) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    function addQuotaRow() {
        setForm((f) => ({ ...f, skill_quota: [...f.skill_quota, { id: "", quantity: 0 }] }));
    }
    function removeQuotaRow(index: number) {
        setForm((f) => ({ ...f, skill_quota: f.skill_quota.filter((_, i) => i !== index) }));
    }
    function setQuotaSkill(index: number, skillId: string) {
        setForm((f) => {
            const next = [...f.skill_quota];
            next[index] = { ...next[index], id: skillId, name: skills.find((s) => s.id === skillId)?.name };
            return { ...f, skill_quota: next };
        });
    }
    function setQuotaQty(index: number, qty: number) {
        setForm((f) => {
            const next = [...f.skill_quota];
            next[index] = { ...next[index], quantity: qty < 0 ? 0 : qty };
            return { ...f, skill_quota: next };
        });
    }

    const duplicatedSkill = useMemo(() => {
        const ids = form.skill_quota.map((s) => s.id).filter(Boolean);
        const set = new Set<string>();
        for (const id of ids) {
            if (set.has(id)) return true;
            set.add(id);
        }
        return false;
    }, [form.skill_quota]);

    const datesValid =
        !!form.startDate &&
        !!form.endDate &&
        new Date(form.startDate).getTime() <= new Date(form.endDate).getTime();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (disabled) return;

        if (!datesValid) {
            toast.error("La fecha de inicio no puede ser mayor a la fecha fin.");
            return;
        }
        if (duplicatedSkill) {
            toast.error("Hay habilidades repetidas en los cupos.");
            return;
        }
        if (!hasLeader) {
            toast.error("Debes seleccionar un encargado/líder antes de guardar.");
            return;
        }
        try {
            setSaving(true);
            const payload = {
                title: form.title?.trim(),
                description: form.description?.trim(),
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
                location:form.city,
                department:form.department,
                capacity: String(form.capacity ?? "").trim(),
                streetAddress: form.streetAddress?.trim(),
                attendant: String(form.attendant ?? "").trim(),
                skill_quota: form.skill_quota
                    .filter((sq) => sq.id)
                    .map((sq) => ({
                        id: sq.id,
                        qty: Number.isFinite(Number(sq.quantity)) ? Number(sq.quantity) : 0,
                    })),
            };
            console.log(payload)
            const op = updateEventService(eventId, payload).then((res) => {
                if (!res?.success) return Promise.reject(res);
                return res;
            });

            await toast.promise(op, {
                loading: "Guardando cambios...",
                success: (res: { message?: string }) => <b>{res.message ?? "Evento actualizado"}</b>,
                error: (res: { message?: string }) => <b>{res.message ?? "No se pudo actualizar"}</b>,
            });

            await onUpdated?.();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }
    const hasLeader = (form.attendant?.trim()?.length ?? 0) > 0;
    const inputBase =
        "w-full rounded-xl border border-gray-200/60 bg-white/70 px-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none " +
        "transition focus:border-transparent focus:ring-2 focus:ring-black/5 disabled:bg-gray-50 disabled:text-gray-500";
    return (
        <Modal open={open} onClose={onClose} title="Editar evento">
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Información básica */}
                <fieldset className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50/70 to-transparent border-b border-white/30">
      <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-blue-600 text-white shadow">
        <Users className="w-4 h-4" />
      </span>
                        <h3 className="text-sm font-semibold text-gray-800">Información básica</h3>
                        <span className="ml-auto text-[11px] text-gray-500">Obligatorio</span>
                    </div>

                    <div className="p-4 sm:p-6 grid gap-5">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Título</label>
                            <input
                                type="text"
                                required
                                disabled={disabled}
                                value={form.title}
                                onChange={(e) => onChange("title", e.target.value)}
                                className={`${inputBase}  h-12 rounded-2xl border-gray-300 bg-white/70 focus:ring-4 focus:ring-blue-200/60`}
                                placeholder="Nombre del evento"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Descripción</label>
                            <textarea
                                required
                                disabled={disabled}
                                value={form.description}
                                onChange={(e) => onChange("description", e.target.value)}
                                className={`${inputBase} min-h-[120px] rounded-2xl border-gray-300 bg-white/70 focus:ring-4 focus:ring-blue-200/60 leading-relaxed`}
                                placeholder="Breve descripción del evento"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Fechas */}
                <fieldset className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50/70 to-transparent border-b border-white/30">
      <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow">
        <CalendarClock className="w-4 h-4" />
      </span>
                        <h3 className="text-sm font-semibold text-gray-800">Fechas</h3>
                        <span className="ml-auto text-[11px] text-gray-500">America/Bogota</span>
                    </div>

                    <div className="p-4 sm:p-6 grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Fecha inicio</label>
                            <input
                                type="datetime-local"
                                required
                                disabled={disabled}
                                value={form.startDate}
                                onChange={(e) => onChange("startDate", e.target.value)}
                                className={`${inputBase} h-12 rounded-2xl border-gray-300 bg-white/70 focus:ring-4 focus:ring-indigo-200/60 ${!datesValid ? "border-red-300 focus:ring-red-200/70" : ""}`}
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Fecha fin</label>
                            <input
                                type="datetime-local"
                                required
                                disabled={disabled}
                                value={form.endDate}
                                onChange={(e) => onChange("endDate", e.target.value)}
                                className={`${inputBase} h-12 rounded-2xl border-gray-300 bg-white/70 focus:ring-4 focus:ring-indigo-200/60 ${!datesValid ? "border-red-300 focus:ring-red-200/70" : ""}`}
                            />
                        </div>
                    </div>

                    {!datesValid && (
                        <div className="mx-4 mb-4 -mt-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
                            <span className="inline-block size-2 rounded-full bg-red-500" />
                            <p>La fecha de inicio debe ser menor o igual a la fecha fin.</p>
                        </div>
                    )}
                </fieldset>

                {/* Ubicación y cupo */}
                <fieldset className="rounded-3xl border border-gray-300 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50/70 to-transparent border-b border-white/30">
      <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow">
        <MapPin className="w-4 h-4" />
      </span>
                        <h3 className="text-sm font-semibold text-gray-800">Ubicación y cupo</h3>
                    </div>

                    <div className="p-4 sm:p-6 grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Municipio</label>
                            <select
                                disabled={disabled}
                                value={form.department}
                                required
                                onChange={(e) => onChange("department", e.target.value)}
                                className={`${inputBase} h-12 rounded-2xl border-white/30 bg-white focus:ring-4 focus:ring-emerald-200/60`}
                            >
                                <option value="">Selecciona un municipio…</option>
                                {departments.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Municipio</label>
                            <select
                                disabled={!form.department}
                                value={form.city}
                                required
                                onChange={(e) => onChange("city", e.target.value)}
                                className={`${inputBase} h-12 rounded-2xl border-white/30 bg-white focus:ring-4 focus:ring-emerald-200/60`}
                            >
                                <option value="">Selecciona un municipio…</option>
                                {citiesOptions.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Cupo total</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={0}
                                    disabled={disabled}
                                    value={form.capacity}
                                    onChange={(e) => onChange("capacity", e.target.value)}
                                    className={`${inputBase} h-12 rounded-2xl border-gray-300 bg-white/70 pr-12 focus:ring-4 focus:ring-emerald-200/60`}
                                    placeholder="0"
                                />
                                <Users className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="sm:col-span-2 grid gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Dirección</label>
                            <input
                                type="text"
                                disabled={disabled}
                                value={form.streetAddress}
                                onChange={(e) => onChange("streetAddress", e.target.value)}
                                className={`${inputBase} h-12 rounded-2xl border-gray-300 bg-white/70 focus:ring-4 focus:ring-emerald-200/60`}
                                placeholder="Calle 123 #45-67"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Líder */}
                <fieldset className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50/70 to-transparent border-b border-white/30">
      <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-amber-500 text-white shadow">
        <UserRoundCog className="w-4 h-4" />
      </span>
                        <h3 className="text-sm font-semibold text-gray-800">Encargado / Líder</h3>
                    </div>

                    <div className="p-4 sm:p-6 grid gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <input
                                type="text"
                                value={leaderName}
                                disabled
                                className={`${inputBase} h-12 rounded-2xl bg-gray-50 text-gray-700 border-gray-300`}
                                placeholder="Sin líder seleccionado"
                            />
                            <Button
                                type="button"
                                onClick={() => setLeaderModalOpen(true)}
                                disabled={disabled}
                                className="rounded-2xl shadow-sm hover:shadow transition"
                                title="Cambiar encargado"
                                variant="secondary"
                            >
                                <UserRoundCog className="w-4 h-4 mr-2" />
                                Cambiar
                            </Button>
                        </div>
                        <input type="hidden" value={form.attendant} readOnly />
                    </div>
                </fieldset>

                {/* Cupos por habilidad */}
                <fieldset className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-50/70 to-transparent border-b border-white/30">
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-slate-700 text-white shadow">%</span>
                            <h3 className="text-sm font-semibold text-gray-800">Cupos por habilidad</h3>
                        </div>
                        {form.skill_quota.length > 0 && (
                            <span className="ml-auto text-[11px] text-gray-600">
          Total filas: <span className="font-semibold">{form.skill_quota.length}</span>
        </span>
                        )}
                    </div>

                    <div className="p-4 sm:p-6">
                        {form.skill_quota.length === 0 ? (
                            <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-white/60 p-4">
                                <p className="text-sm text-gray-600">No hay cupos definidos.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="divide-y divide-gray-100 rounded-2xl border border-white/40 overflow-hidden">
                                    {form.skill_quota.map((row, idx) => (
                                        <div
                                            key={`${idx}-${row.id}`}
                                            className="grid gap-2 sm:grid-cols-[1fr_170px_44px] items-center p-2.5 bg-white/70 hover:bg-white transition"
                                        >
                                            <select
                                                disabled={disabled}
                                                value={row.id}
                                                onChange={(e) => setQuotaSkill(idx, e.target.value)}
                                                className={`${inputBase} h-11 rounded-xl bg-white border-gray-300 focus:ring-4 focus:ring-slate-200/70`}
                                            >
                                                <option value="">Habilidad…</option>
                                                {skills.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>

                                            <input
                                                type="number"
                                                min={0}
                                                disabled={disabled}
                                                value={row.quantity}
                                                onChange={(e) => setQuotaQty(idx, Number(e.target.value))}
                                                className={`${inputBase} h-11 rounded-xl border-gray-300 bg-white/80 focus:ring-4 focus:ring-slate-200/70`}
                                                placeholder="Cupos"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeQuotaRow(idx)}
                                                disabled={disabled}
                                                className="justify-self-end sm:justify-self-auto inline-flex items-center justify-center rounded-xl p-2.5 text-red-600 hover:bg-red-50/80 active:scale-95 transition"
                                                title="Quitar fila"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {duplicatedSkill && (
                            <p className="mt-3 text-xs text-amber-800 bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5">
                                Hay habilidades repetidas. Selecciona cada habilidad una sola vez.
                            </p>
                        )}
                    </div>
                </fieldset>

                {/* Footer fijo */}
                <div className="sticky bottom-0 -mx-4 rounded-b-3xl border-t border-white/30 bg-white/80 backdrop-blur-xl px-4 py-3 shadow-[0_-12px_30px_-16px_rgba(0,0,0,0.15)] [@supports(height:1svh)]:pb-[max(env(safe-area-inset-bottom),0.75rem)]">
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-2xl bg-red-500 hover:bg-red-600 text-white">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || disabled || !hasLeader}
                            className={`rounded-2xl shadow-sm bg-blue-500 hover:bg-blue-600 text-white ${disabled ? "bg-gray-300 text-gray-600" : ""}`}
                            title={
                                disabled
                                    ? "Edición deshabilitada"
                                    : !hasLeader
                                        ? "Selecciona un encargado/líder para continuar"
                                        : "Guardar cambios"
                            }
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
                        </Button>
                    </div>

                    {disabled && (
                        <p className="mt-2 text-xs text-amber-800 bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5">
                            El evento está en curso. Solo el líder puede editar.
                        </p>
                    )}
                </div>
            </form>

            <Modal open={leaderModalOpen} onClose={() => setLeaderModalOpen(false)} title="Seleccionar encargado">
                <ChangeLeaderTable
                    users={users}
                    onSelect={(documentLeader: string, name: string) => {
                        setForm((f) => ({ ...f, attendant: documentLeader }));
                        setLeaderName(name);
                        setLeaderModalOpen(false);
                    }}
                    onCancel={() => setLeaderModalOpen(false)}
                />
            </Modal>
        </Modal>
    );
}
