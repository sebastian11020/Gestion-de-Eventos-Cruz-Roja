"use client";
import { Field } from "@/components/layout/field";
import { FancyCard } from "@/components/cards/fancyCard";
import { CalendarClock, ListChecks } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";

export function BasicInfoSection({
                                     form,
                                     onChange,
                                 }: {
    form: CreateEventForm;
    onChange: <K extends keyof CreateEventForm>(key: K, value: CreateEventForm[K]) => void;
}) {
    return (
        <FancyCard title="Información básica" icon={<ListChecks className="w-4 h-4" />}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <Field label="Nombre del evento">
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => onChange("name", e.target.value)}
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
                        onChange={(e) => onChange("startDate", e.target.value)}
                        className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                    />
                </Field>

                <Field label="Fecha fin" icon={<CalendarClock className="w-4 h-4" />}>
                    <input
                        type="datetime-local"
                        required
                        value={form.endDate}
                        onChange={(e) => onChange("endDate", e.target.value)}
                        className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                    />
                </Field>

                <div className="sm:col-span-2">
                    <Field label="Descripción">
            <textarea
                required
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
                rows={3}
                placeholder="Cuéntanos de qué trata el evento…"
            />
                    </Field>
                </div>
            </div>
        </FancyCard>
    );
}