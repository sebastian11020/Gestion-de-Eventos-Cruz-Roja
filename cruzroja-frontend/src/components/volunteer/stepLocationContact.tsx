"use client";
import { fieldBase, labelBase } from "@/components/volunteer/fields";
import {SectionalNode, GroupNode, type ProgramItem} from "@/types/programType";
import {useMemo} from "react";

export function StepLocationContact({
                                        form,
                                        cities,
                                        sectionals,
                                        handleChange,
                                        handleNested,
                                        handleGroupChange,
                                        handleProgramChange,
                                    }: {
    form: any;
    cities: { id: string; name: string }[] | undefined;
    sectionals: SectionalNode[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleNested: (
        group: "emergencyContact" | "address",
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    handleGroupChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleProgramChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {

    const sectionalSelected = useMemo(
        () =>
            sectionals.find((c) => String(c.id) === String(form.id_headquarters)) || null,
        [sectionals, form.id_headquarters],
    );
    const groupOptions:GroupNode[] = sectionalSelected?.groups ?? [];

    const groupSelected = useMemo(
        () => groupOptions.find((g) => String(g.id) === String(form.id_group)) || null,
        [groupOptions, form.id_group],
    );
    const programOptions: ProgramItem[] = groupSelected?.program ?? [];

    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
                <label className={labelBase}>
                    Ciudad / Municipio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select name="id_location" value={form.id_location} onChange={handleChange} className={`${fieldBase} appearance-none`} required>
                        <option value="" disabled>
                            Seleccione…
                        </option>
                        {cities?.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>
            </div>

            <div>
                <label className={labelBase}>
                    Barrio <span className="text-red-500">*</span>
                </label>
                <input type="text" name="zone" value={form.address.zone} onChange={(e) => handleNested("address", e)} className={fieldBase} />
            </div>

            <div className="relative">
                <label className={labelBase}>Sede</label>
                <select name="id_headquarters" value={form.id_headquarters} onChange={handleChange} className={`${fieldBase} appearance-none`} required>
                    <option value="" disabled>
                        Seleccione…
                    </option>
                    {sectionals.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.city}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <label className={labelBase}>Agrupacion</label>
                <select name="id_group" value={form.id_group} onChange={handleGroupChange} className={`${fieldBase} appearance-none`}>
                    <option value="" disabled>
                        Seleccione…
                    </option>
                    {groupOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <label className={labelBase}>Programa</label>
                <select name="id_program" value={form.id_program} onChange={handleProgramChange} className={`${fieldBase} appearance-none`}>
                    <option value="" disabled>
                        Seleccione…
                    </option>
                    {programOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="md:col-span-3">
                <label className={labelBase}>
                    Dirección <span className="text-red-500">*</span>
                </label>
                <input type="text" name="streetAddress" value={form.address.streetAddress} onChange={(e) => handleNested("address", e)} className={fieldBase} />
            </div>

            <div>
                <label className={labelBase}>
                    Correo <span className="text-red-500">*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={fieldBase} required />
            </div>
            <div>
                <label className={labelBase}>
                    Celular <span className="text-red-500">*</span>
                </label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={fieldBase} required />
            </div>
        </section>
    );
}
