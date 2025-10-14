"use client";
import { fieldBase, labelBase } from "@/components/volunteer/fields";
import { BLOOD_TYPES, DOCUMENT_TYPES } from "@/const/consts";

export function StepIdentification({
  form,
  handleChange,
}: {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white/70 p-4 shadow-sm space-y-4">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] items-start">
        <div>
          <label className={labelBase}>
            Tipo de documento <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="type_document"
              value={form.type_document}
              onChange={handleChange}
              className={fieldBase}
              required
            >
              <option value="" disabled>
                Seleccione…
              </option>
              {DOCUMENT_TYPES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelBase}>
            Documento <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            name="document"
            value={form.document}
            onChange={handleChange}
            className={fieldBase}
            required
          />
        </div>
        <div>
          <label className={labelBase}>N° Carnet</label>
          <input
            type="text"
            name="carnet"
            value={form.carnet}
            onChange={handleChange}
            className={fieldBase}
          />
        </div>
        <div>
          <label className={labelBase}>
            Tipo de sangre <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="blood"
              value={form.blood}
              onChange={handleChange}
              className={fieldBase}
              required
            >
              <option value="" disabled>
                Seleccione…
              </option>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
