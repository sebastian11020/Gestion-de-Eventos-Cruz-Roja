"use client";
import { FancyCard } from "@/components/cards/fancyCard";
import { Field } from "@/components/layout/field";
import { Layers3 } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";
import { classificationEvent, frame, scope } from "@/types/eventsType";

export function ClassificationSection({
  form,
  onChange,
  scopes,
  classifications,
  marcos,
}: {
  form: CreateEventForm;
  onChange: <K extends keyof CreateEventForm>(
    key: K,
    value: CreateEventForm[K],
  ) => void;
  scopes: scope[];
  classifications: classificationEvent[];
  marcos: frame[];
}) {
  return (
    <FancyCard
      title="Clasificación del evento"
      icon={<Layers3 className="w-4 h-4" />}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Ámbito">
          <select
            required
            value={form.ambit}
            onChange={(e) => onChange("ambit", e.target.value)}
            className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none"
          >
            <option value="">Seleccione…</option>
            {scopes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
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
              <option key={o.id} value={o.id}>
                {o.name}
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
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </FancyCard>
  );
}
