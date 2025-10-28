"use client";
import { Field } from "@/components/layout/field";
import { FancyCard } from "@/components/cards/fancyCard";
import { CalendarClock, ListChecks } from "lucide-react";
import type { CreateEventForm } from "@/types/usertType";
import { useMemo } from "react";

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function BasicInfoSection({
  form,
  onChange,
}: {
  form: CreateEventForm;
  onChange: <K extends keyof (CreateEventForm & { isEmergency?: boolean })>(
    key: K,
    value: (CreateEventForm & { isEmergency?: boolean })[K],
  ) => void;
}) {
  const nowLocal = useMemo(() => new Date(), []);
  const nowMin = toLocalInputValue(nowLocal);
  const start = form.startDate ? new Date(form.startDate) : null;
  const end = form.endDate ? new Date(form.endDate) : null;
  const startMin = form.isEmergency ? undefined : nowMin;
  const endMin =
    form.startDate && form.startDate.length > 0
      ? form.startDate
      : form.isEmergency
        ? undefined
        : nowMin;

  const handleToggleEmergency = (checked: boolean) => {
    onChange("isEmergency", checked);
    if (!checked && start && start < nowLocal) {
      const fixedStart = nowMin;
      onChange("startDate", fixedStart as any);
      if (form.endDate && new Date(form.endDate) < new Date(fixedStart)) {
        onChange("endDate", fixedStart as any);
      }
    }
  };

  const handleStartChange = (value: string) => {
    onChange("startDate", value as any);
    if (form.endDate && new Date(form.endDate) < new Date(value)) {
      onChange("endDate", value as any);
    }
  };

  const handleEndChange = (value: string) => {
    if (form.startDate && new Date(value) < new Date(form.startDate)) {
      onChange("endDate", form.startDate as any);
    } else {
      onChange("endDate", value as any);
    }
  };

  return (
    <FancyCard
      title="Información básica"
      icon={<ListChecks className="w-4 h-4" />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Nombre del evento">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => onChange("name", e.target.value as any)}
              className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
              placeholder="Ej. Capacitación en Primeros Auxilios"
            />
          </Field>
        </div>

        {/* ✔️ Checkbox de emergencia */}
        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded-md"
              checked={form.isEmergency}
              onChange={(e) => handleToggleEmergency(e.target.checked)}
            />
            <span>¿Es emergencia?</span>
          </label>
        </div>

        <Field
          label="Fecha inicio"
          icon={<CalendarClock className="w-4 h-4" />}
        >
          <input
            type="datetime-local"
            required
            value={form.startDate ?? ""}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
            min={startMin}
          />
        </Field>

        <Field label="Fecha fin" icon={<CalendarClock className="w-4 h-4" />}>
          <input
            type="datetime-local"
            required
            value={form.endDate ?? ""}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full rounded-2xl px-2 py-2 text-sm focus:outline-none"
            min={endMin}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Descripción">
            <textarea
              required
              value={form.description}
              onChange={(e) => onChange("description", e.target.value as any)}
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
