"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Field } from "@/components/layout/field";
import { Layers3 } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";

export function ClassificationSection({
                                          form,
                                          onChange,
                                          ambits,
                                          classifications,
                                          marcos,
                                      }: {
    form: CreateEventForm;
    onChange: <K extends keyof CreateEventForm>(key: K, value: CreateEventForm[K]) => void;
    ambits: { value: string; label: string }[];
    classifications: { value: string; label: string }[];
    marcos: { value: string; label: string }[];
}) {
    return (
        <FancyCard title="Clasificación del evento" icon={<Layers3 className="w-4 h-4" />}>
            <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Ámbito">
                    <select
                        required
                        value={form.ambit}
                        onChange={(e) => onChange("ambit", e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                    >
                        <option value="">Seleccione…</option>
                        {ambits.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Clasificación">
                    <select
                        required
                        value={form.classification}
                        onChange={(e) => onChange("classification", e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                    >
                        <option value="">Seleccione…</option>
                        {classifications.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Marco">
                    <select
                        required
                        value={form.marcActivity}
                        onChange={(e) => onChange("marcActivity", e.target.value)}
                        className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
                    >
                        <option value="">Seleccione…</option>
                        {marcos.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
        </FancyCard>
    );
}
