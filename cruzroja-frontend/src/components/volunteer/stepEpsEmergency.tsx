"use client";
import { fieldBase, labelBase } from "@/components/volunteer/fields";
import { EPS_TYPES } from "@/const/consts";

export function StepEpsEmergency({
                                     form,
                                     eps,
                                     handleChange,
                                     handleNested,
                                 }: {
    form: any;
    eps: { id: string; name: string }[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleNested: (
        group: "emergencyContact" | "address",
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}) {
    return (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">EPS</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelBase}>
                            Nombre EPS <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select name="id_eps" value={form.id_eps} onChange={handleChange} className={`${fieldBase} appearance-none`}>
                                <option value="" disabled>
                                    Seleccione…
                                </option>
                                {eps.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
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
                            Régimen <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select name="type_affiliation" value={form.type_affiliation} onChange={handleChange} className={`${fieldBase} appearance-none`}>
                                <option value="" disabled>
                                    Seleccione…
                                </option>
                                {EPS_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
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
                </div>
            </div>

            <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Contacto de Emergencia</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className={labelBase}>
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="name" value={form.emergencyContact.name} onChange={(e) => handleNested("emergencyContact", e)} className={fieldBase} />
                    </div>
                    <div>
                        <label className={labelBase}>
                            Parentesco <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="relationShip" value={form.emergencyContact.relationShip} onChange={(e) => handleNested("emergencyContact", e)} className={fieldBase} />
                    </div>
                    <div>
                        <label className={labelBase}>
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" name="phone" value={form.emergencyContact.phone} onChange={(e) => handleNested("emergencyContact", e)} className={fieldBase} />
                    </div>
                </div>
            </div>
        </section>
    );
}