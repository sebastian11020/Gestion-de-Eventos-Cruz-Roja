"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Field } from "@/components/layout/field";
import { Landmark, Building2, MapPin } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";
import type { CityOption } from "@/components/forms/createEventForm";
import type { GroupNode, SectionalNode } from "@/types/programType";

export function LocationSection({
                                    form,
                                    onChange,
                                    cities,
                                    sectionals,
                                    onChangeSectional,
                                    groupOptions,
                                }: {
    form: CreateEventForm;
    onChange: <K extends keyof CreateEventForm>(key: K, value: CreateEventForm[K]) => void;
    cities: CityOption[];
    sectionals: SectionalNode[];
    onChangeSectional: (value: string) => void;
    groupOptions: GroupNode[];
}) {
    return (
        <FancyCard title="Ubicación y seccional" icon={<MapPin className="w-4 h-4" />}>
            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departamento" icon={<Landmark className="w-4 h-4" />}>
                    <input type="text" value={form.department} readOnly className="w-full rounded-2xl bg-gray-100 px-2 py-2 text-sm focus:outline-none" />
                </Field>

                <Field label="Municipio" icon={<Building2 className="w-4 h-4" />}>
                    <select
                        required
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                    >
                        <option value="">Seleccione…</option>
                        {cities.map((m) => (
                            <option key={m.id} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Dirección">
                    <input
                        type="text"
                        required
                        value={form.streetAddress}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                        placeholder="Ej. Cra 15 #4-16"
                    />
                </Field>

                <Field label="Sede">
                    <select
                        required
                        value={form.sectionalId}
                        onChange={(e) => onChangeSectional(e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                    >
                        <option value="">Seleccione…</option>
                        {sectionals.map((s) => (
                            <option key={s.id} value={String(s.id)}>
                                {s.city}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Agrupación">
                    <select
                        disabled={!form.sectionalId}
                        value={form.groupId}
                        onChange={(e) => onChange("groupId", e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none disabled:bg-gray-100"
                    >
                        <option value="">{form.sectionalId ? "Seleccione…" : "Elija seccional"}</option>
                        {groupOptions.map((g) => (
                            <option key={g.id} value={String(g.id)}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
        </FancyCard>
    );
}