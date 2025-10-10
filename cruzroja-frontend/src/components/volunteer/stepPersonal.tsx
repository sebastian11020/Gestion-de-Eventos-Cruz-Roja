"use client";
import { fieldBase, labelBase } from "@/components/volunteer/fields";
import { GEN_OPTIONS, SEX_OPTIONS, STATE_TYPES } from "@/const/consts";

export function StepPersonal({
  form,
  handleChange,
}: {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelBase}>
          Nombres <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={fieldBase}
          required
        />
      </div>
      <div>
        <label className={labelBase}>
          Apellidos <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className={fieldBase}
          required
        />
      </div>
      <div>
        <label className={labelBase}>
          Sexo <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className={`${fieldBase} appearance-none`}
            required
          >
            <option value="" disabled>
              Seleccione…
            </option>
            {SEX_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelBase}>
          Genero<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={`${fieldBase} appearance-none`}
            required
          >
            <option value="" disabled>
              Seleccione…
            </option>
            {GEN_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelBase}>Estado</label>
        <div className="relative">
          <select
            name="id_state"
            value={form.id_state}
            onChange={handleChange}
            className={`${fieldBase} appearance-none`}
            required
          >
            {STATE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelBase}>
          Fecha de nacimiento <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className={fieldBase}
          max={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
    </section>
  );
}
