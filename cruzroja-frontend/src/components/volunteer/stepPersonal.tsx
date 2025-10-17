"use client";
import { fieldBase, labelBase } from "@/components/volunteer/fields";
import { GEN_OPTIONS, SEX_OPTIONS } from "@/const/consts";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { MultiSelectChips } from "@/components/buttons/multiSelectChips";

export function StepPersonal({
                                 form,
                                 handleChange,
                                 onChangeSkills,
                             }: {
    form: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onChangeSkills: (next: string[]) => void;
}) {
    const { state, skills } = useSectionalsNode();

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

            {/* Fila interna que ocupa 2 columnas y las divide en 2 */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Habilidades */}
                <div>
                    <label className={labelBase}>Habilidades</label>
                    <div className="relative">
                        <MultiSelectChips
                            options={skills.map((s) => ({ id: String(s.id), name: s.name ?? "" }))}
                            value={form.skills}
                            onChange={onChangeSkills}
                        />
                    </div>
                </div>

                <div className="pt-8">
                    <label className={labelBase}>Estado <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            name="id_state"
                            value={form.id_state}
                            onChange={handleChange}
                            className={`${fieldBase} appearance-none h-9`}
                            required
                        >
                            <option value="">
                                Seleccione…
                            </option>
                            {state.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
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
                    max={new Date(
                        new Date().setFullYear(new Date().getFullYear() - 8)
                    ).toISOString().split("T")[0]}
                    required
                />
            </div>
        </section>
    );
}
