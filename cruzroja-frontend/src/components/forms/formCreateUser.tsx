"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import { sectional, group, formCreatePerson, eps } from "@/types/usertType";
import { getCities, getEPS } from "@/services/serviceSelect";
import {
  DOCUMENT_TYPES,
  GEN_OPTIONS,
  SEX_OPTIONS,
  BLOOD_TYPES,
  STATE_TYPES,
  EPS_TYPES,
} from "@/const/consts";
import { generatePassword } from "@/utils/generatePassword";

type cities = {
  id: string;
  name: string;
};

let INITIAL_FORM: formCreatePerson = {
  id: "",
  type_document: "",
  document: "",
  carnet: "",
  name: "",
  lastName: "",
  blood: "",
  sex: "",
  gender: "",
  id_state: "Formacion",
  birthDate: "",
  id_location: "",
  address: {
    streetAddress: "",
    zone: "",
  },
  email: "",
  phone: "",
  emergencyContact: { name: "", relationShip: "", phone: "" },
  id_headquarter: "",
  id_group: "",
  id_program: "",
  id_eps: "",
  type_affiliation: "",
};

const SECTIONAL_TYPES: sectional[] = [
  {
    id: "1",
    city: "Tunja",
  },
  {
    id: "2",
    city: "Duitama",
  },
  {
    id: "3",
    city: "Sogamoso",
  },
];

const GRUOP_TYPES: group[] = [
  {
    id: "1",
    name: "Juventud",
    program: [
      {
        id: "1",
        name: "Programa al aire libre",
      },
      {
        id: "2",
        name: "Infantiles y Pre-juveniles",
      },
      {
        id: "3",
        name: "Servicio social estudiantil",
      },
      {
        id: "4",
        name: "Recreacion",
      },
    ],
  },
  {
    id: "2",
    name: "Socorrismo",
    program: [
      {
        id: "5",
        name: "Busqueda y Rescate",
      },
      {
        id: "6",
        name: "Busqueda y rescate con caninos",
      },
      {
        id: "7",
        name: "Servicios especiales",
      },
    ],
  },
  {
    id: "3",
    name: "Damas Grises",
    program: [
      {
        id: "8",
        name: "PAMES",
      },
      {
        id: "9",
        name: "PEDEC",
      },
    ],
  },
];

const fieldBase =
  "w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 pr-7 text-sm text-gray-700 shadow-sm " +
  "placeholder:text-gray-400 transition-colors hover:border-gray-400 " +
  "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 " +
  "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500/20";

const labelBase = "mb-1 block text-sm font-medium text-gray-700";

export default function VolunteerWizard({
  open,
  onClose,
  onSubmit,
  editForm,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: formCreatePerson) => void;
  editForm: formCreatePerson | null;
}) {
  const [step, setStep] = useState(0);
  const steps = [
    "Identificación",
    "Personales",
    "Ubicación/Contacto",
    "EPS & Emergencia",
    "Revisión",
  ];
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const [form, setForm] = useState<formCreatePerson>(INITIAL_FORM);
  const [cities, setCities] = useState<cities[]>();
  const [eps, setEps] = useState<eps[]>([]);

  useEffect(() => {
    if (!open) return;
    getMunicipalities();
    getEps();
    if (editForm) {
      setForm(editForm);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, editForm]);

  async function getMunicipalities() {
    try {
      const citiesForm: cities[] = await getCities();
      setCities(citiesForm);
    } catch (error) {
      console.error(error);
    }
  }

  async function getEps() {
    try {
      const epsForm: eps[] = await getEPS();
      setEps(epsForm);
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };
  const programs = useMemo(() => {
    const g = GRUOP_TYPES.find((g) => g.id === form.id_group);
    return g?.program ?? [];
  }, [form.id_group]);

  const handleNested = (
    group: "emergencyContact" | "address",
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [group]: { ...(s as any)[group], [name]: value },
    }));
  };
  function handleGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const groupId = e.target.value;
    const g = GRUOP_TYPES.find((x) => x.id === groupId);
    setForm((s) => ({
      ...s,
      id_group: groupId,
    }));
  }

  function handleProgramChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const programId = e.target.value;
    const p = programs.find((x) => x.id === programId);
    setForm((s) => ({
      ...s,
      id_program: programId,
    }));
  }

  const cityMap = useMemo(() => {
    const m = new Map<string, string>();
    (cities ?? []).forEach((c) => m.set(c.id, c.name));
    return m;
  }, [cities]);

  const sectionalMap = useMemo(() => {
    const m = new Map<string, string>();
    SECTIONAL_TYPES.forEach((s) => m.set(String(s.id), s.city));
    return m;
  }, []);

  const groupMap = useMemo(() => {
    const m = new Map<string, string>();
    GRUOP_TYPES.forEach((g) => m.set(String(g.id), g.name));
    return m;
  }, []);

  const programMap = useMemo(() => {
    const m = new Map<string, string>();
    GRUOP_TYPES.forEach((g) =>
      g.program?.forEach((p) => m.set(String(p.id), p.name)),
    );
    return m;
  }, []);

  const epsMap = useMemo(() => {
      const m = new Map<string, string>();
      (eps ?? []).forEach((e) => m.set(String(e.id), e.name));
      return m;
      }, [eps]);

  const canNext = useMemo(() => {
    if (step === 0) {
      return form.type_document && form.document && form.blood;
    }
    if (step === 1) {
      return form.name && form.lastName && form.sex;
    }
    if (step === 2) {
      return form.id_location && form.address && form.email && form.phone;
    }
    if (step === 3) {
      return form.id_eps && form.type_affiliation;
    }
    return true;
  }, [step, form]);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setStep(0);
  };

  const submit = () => {
    onSubmit(form);
    resetForm();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Nuevo voluntario
            </h3>
            <p className="text-xm text-gray-500">
              Los campos marcados con * son obligatorios
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* stepper chips */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {steps.map((label, i) => {
              const isActive = i === step;
              const isCompleted = i < step;

              return (
                <div key={label} className="flex items-center">
                  <span
                    className={[
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                      isActive
                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                        : isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500",
                    ].join(" ")}
                  >
                    <span className="flex size-3.5 items-center justify-center rounded-full border border-current bg-white">
                      {isCompleted ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            isActive ? "bg-white" : "bg-current",
                          ].join(" ")}
                        />
                      )}
                    </span>
                    {label}
                  </span>

                  {i < steps.length - 1 && (
                    <div className="mx-1.5 h-px w-5 flex-shrink-0 bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* body */}
        <div className="max-h[65vh] md:max-h-[65vh] overflow-y-auto px-6 pb-6 pt-4">
          {step === 0 && (
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
                    className={fieldBase} // 👈 sin max-w
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
                    className={fieldBase} // 👈 sin max-w
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
                      className={fieldBase} // 👈 sin max-w
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
          )}

          {step === 1 && (
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
          )}

          {step === 2 && (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelBase}>
                  Ciudad / Municipio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_location"
                    value={form.id_location}
                    onChange={handleChange}
                    className={`${fieldBase} appearance-none`}
                    required
                  >
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
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelBase}>
                  Barrio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zone"
                  value={form.address.zone}
                  onChange={(e) => {
                    handleNested("address", e);
                  }}
                  className={fieldBase}
                />
              </div>

              <div className="relative">
                <label className={labelBase}>Seccional</label>
                <select
                  name="id_headquarter"
                  value={form.id_headquarter}
                  onChange={handleChange}
                  className={`${fieldBase} appearance-none`}
                  required
                >
                  <option value="" disabled>
                    Seleccione…
                  </option>
                  {SECTIONAL_TYPES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className={labelBase}>Agrupacion</label>
                <select
                  name="id_group"
                  value={form.id_group}
                  onChange={handleGroupChange}
                  className={`${fieldBase} appearance-none`}
                >
                  <option value="" disabled>
                    Seleccione…
                  </option>
                  {GRUOP_TYPES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className={labelBase}>Programa</label>
                <select
                  name="id_program"
                  value={form.id_program}
                  onChange={handleProgramChange}
                  className={`${fieldBase} appearance-none`}
                >
                  <option value="" disabled>
                    Seleccione…
                  </option>
                  {programs.map((p) => (
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
                <input
                  type="text"
                  name="streetAddress"
                  value={form.address.streetAddress}
                  onChange={(e) => {
                    handleNested("address", e);
                  }}
                  className={fieldBase}
                />
              </div>

              <div>
                <label className={labelBase}>
                  Correo <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldBase}
                  required
                />
              </div>
              <div>
                <label className={labelBase}>
                  Celular <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={fieldBase}
                  required
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  EPS
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelBase}>
                      Nombre EPS <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="id_eps"
                        value={form.id_eps}
                        onChange={handleChange}
                        className={`${fieldBase} appearance-none`}
                      >
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
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>
                      Régimen <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="type_affiliation"
                        value={form.type_affiliation}
                        onChange={handleChange}
                        className={`${fieldBase} appearance-none`}
                      >
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
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Contacto de Emergencia
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelBase}>
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.emergencyContact.name}
                      onChange={(e) => handleNested("emergencyContact", e)}
                      className={fieldBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>
                      Parentesco <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="relationShip"
                      value={form.emergencyContact.relationShip}
                      onChange={(e) => handleNested("emergencyContact", e)}
                      className={fieldBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.emergencyContact.phone}
                      onChange={(e) => handleNested("emergencyContact", e)}
                      className={fieldBase}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-3">
              <p className="text-sm text-gray-600">
                Revisa la información antes de guardar.
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Identificación
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Tipo Doc:</strong> {form.type_document}
                    </li>
                    <li>
                      <strong>Documento:</strong> {form.document}
                    </li>
                    <li>
                      <strong>N° Carnet:</strong> {form.carnet || "-"}
                    </li>
                    <li>
                      <strong>Sangre:</strong> {form.blood}
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">Personales</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Nombre:</strong> {form.name} {form.lastName}
                    </li>
                    <li>
                      <strong>Sexo:</strong> {form.sex}
                    </li>
                    <li>
                      <strong>Estado:</strong> {form.id_state}
                    </li>
                    <li>
                      <strong>Fecha de nacimiento:</strong> {form.birthDate}
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Ubicación & Contacto
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Ciudad:</strong>{" "}
                      {cityMap.get(form.id_location) ?? "—"}
                    </li>
                    <li>
                      <strong>Dirección:</strong>{" "}
                      {form.address.streetAddress || "—"}
                    </li>
                    <li>
                      <strong>Barrio:</strong> {form.address.zone || "—"}
                    </li>
                    <li>
                      <strong>Celular:</strong> {form.phone || "—"}
                    </li>
                    <li>
                      <strong>Email:</strong> {form.email || "—"}
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">Asignación</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Seccional:</strong>{" "}
                      {sectionalMap.get(String(form.id_headquarter)) ?? "—"}
                    </li>
                    <li>
                      <strong>Agrupación:</strong>{" "}
                      {groupMap.get(String(form.id_group)) ?? "—"}
                    </li>
                    <li>
                      <strong>Programa:</strong>{" "}
                      {programMap.get(String(form.id_program)) ?? "—"}
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">
                    EPS & Emergencia
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>EPS:</strong>{" "}
                      {epsMap
                        ? (epsMap.get(String(form.id_eps)) ?? "—")
                        : form.id_eps || "—"}{" "}
                      ({form.type_affiliation || "—"})
                    </li>
                    <li>
                      <strong>Emergencia:</strong>{" "}
                      {form.emergencyContact.name || "—"} (
                      {form.emergencyContact.relationShip || "—"}) -{" "}
                      {form.emergencyContact.phone || "—"}
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-2 bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg  px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              onClick={resetForm}
              type="button"
              className="rounded-lg  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Limpiar
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                type="button"
                className="rounded-lg  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Anterior
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                type="button"
                disabled={!canNext}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={submit}
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
