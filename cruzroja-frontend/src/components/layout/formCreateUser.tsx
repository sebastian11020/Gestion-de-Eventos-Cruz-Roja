"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import { FormState } from "@/types/usertType";

let INITIAL_FORM: FormState = {
  typeDocument: "",
  document: "",
  carnet: "",
  name: "",
  lastName: "",
  bloodType: "",
  sex: "",
  state: "Formacion",
  bornDate: "",
  profession: "",
  department: "Boyacá",
  city: "",
  zone: "",
  address: "",
  email: "",
  cellphone: "",
  emergencyContact: { name: "", relationShip: "", phone: "" },
  eps: { name: "", type: "" },
  picture: "",
};

const DOCUMENT_TYPES = ["CC", "TI", "CE", "PAS"];
const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const SEX_OPTIONS = ["Masculino", "Femenino"];
const PROFESSIONS = [
  "Estudiante",
  "Docente",
  "Médico",
  "Enfermero",
  "Paramédico",
  "Odontólogo",
  "Psicólogo",
  "Trabajador Social",
  "Ingeniero de Sistemas",
  "Ingeniero Civil",
  "Abogado",
  "Administrador",
  "Contador",
  "Comunicador Social",
  "Arquitecto",
  "Diseñador",
  "Conductor",
  "Técnico en Sistemas",
  "Tecnólogo en Gestión",
  "Auxiliar de Enfermería",
  "Bacteriólogo",
  "Fisioterapeuta",
  "Nutricionista",
  "Veterinario",
  "Agrónomo",
  "Comerciante",
  "Independiente",
  "Desarrollador de Software",
];
const MUNICIPALITIES_BOYACA = [
  "Almeida",
  "Aquitania",
  "Arcabuco",
  "Belén",
  "Berbeo",
  "Betéitiva",
  "Boavita",
  "Boyacá",
  "Briceño",
  "Buenavista",
  "Busbanzá",
  "Caldas",
  "Campohermoso",
  "Cerinza",
  "Chinavita",
  "Chiquinquirá",
  "Chíquiza",
  "Chiscas",
  "Chita",
  "Chitaraque",
  "Chivatá",
  "Ciénega",
  "Cómbita",
  "Coper",
  "Corrales",
  "Covarachía",
  "Cubará",
  "Cucaita",
  "Cuítiva",
  "Duitama",
  "El Cocuy",
  "El Espino",
  "Firavitoba",
  "Floresta",
  "Gachantivá",
  "Gámeza",
  "Garagoa",
  "Guacamayas",
  "Guateque",
  "Guayatá",
  "Güicán",
  "Iza",
  "Jenesano",
  "Jericó",
  "La Capilla",
  "La Uvita",
  "La Victoria",
  "Labranzagrande",
  "Macanal",
  "Maripí",
  "Miraflores",
  "Mongua",
  "Monguí",
  "Moniquirá",
  "Motavita",
  "Muzo",
  "Nobsa",
  "Nuevo Colón",
  "Oicatá",
  "Otanche",
  "Pachavita",
  "Páez",
  "Paipa",
  "Pajarito",
  "Panqueba",
  "Pauna",
  "Paya",
  "Paz de Río",
  "Pesca",
  "Pisba",
  "Puerto Boyacá",
  "Quípama",
  "Ramiriquí",
  "Ráquira",
  "Rondón",
  "Saboyá",
  "Sáchica",
  "Samacá",
  "San Eduardo",
  "San José de Pare",
  "San Luis de Gaceno",
  "San Mateo",
  "San Miguel de Sema",
  "San Pablo de Borbur",
  "Santa María",
  "Santa Rosa de Viterbo",
  "Santa Sofía",
  "Santana",
  "Sativanorte",
  "Sativasur",
  "Siachoque",
  "Soatá",
  "Socha",
  "Socotá",
  "Sogamoso",
  "Somondoco",
  "Sora",
  "Soracá",
  "Sotaquirá",
  "Susacón",
  "Sutamarchán",
  "Sutatenza",
  "Tasco",
  "Tenza",
  "Tibaná",
  "Tibasosa",
  "Tinjacá",
  "Tipacoque",
  "Toca",
  "Togüí",
  "Tópaga",
  "Tota",
  "Tunja",
  "Tununguá",
  "Turmequé",
  "Tuta",
  "Tutazá",
  "Umbita",
  "Ventaquemada",
  "Villa de Leyva",
  "Viracachá",
  "Zetaquira",
];
const EPS_CO = [
  "Nueva EPS",
  "Sura",
  "Sanitas",
  "Salud Total",
  "Compensar",
  "Coosalud",
  "Famisanar",
  "Capital Salud",
  "Mutual Ser",
  "Savia Salud",
  "SOS (Comfandi)",
  "Asmet Salud",
  "Emssanar",
  "Ecoopsos",
  "Cajacopi",
  "Otra",
];
const EPS_TYPES = ["Contributivo", "Subsidiado"];
const STATE_TYPES = [
  "Formacion",
  "Activo",
  "Inactivo",
  "Licencia",
  "Desvinculado",
];

const fieldBase =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 shadow-sm " +
  "placeholder:text-gray-400 transition-colors hover:border-gray-400 " +
  "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 " +
  "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/20";

const labelBase = "mb-1 block text-sm font-medium text-gray-700";

export default function VolunteerWizard({
  open,
  onClose,
  onSubmit,
  editForm,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
  editForm: FormState | null;
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
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  useEffect(() => {
    if (!open) return;
    if (editForm) {
      setForm(editForm);
    } else {
      setForm(INITIAL_FORM);
    }
  }, [open, editForm]);

  const normalizeText = (s: string) => {
    return (s ?? "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleNested = (
    group: "emergencyContact" | "eps",
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [group]: { ...(s as any)[group], [name]: value },
    }));
  };
  const [profOpen, setProfOpen] = useState(false);
  const profSuggestions = useMemo(() => {
    const q = normalizeText(form.profession.trim());
    if (!q) return PROFESSIONS.slice(0, 8);
    return PROFESSIONS.filter((p) => normalizeText(p).includes(q)).slice(0, 8);
  }, [form.profession]);

  const selectProfession = (p: string) => {
    setForm((s) => ({ ...s, profession: p }));
    setProfOpen(false);
  };
  const canNext = useMemo(() => {
    if (step === 0) {
      return form.typeDocument && form.document && form.bloodType;
    }
    if (step === 1) {
      return form.name && form.lastName && form.sex;
    }
    if (step === 2) {
      return form.city && form.address && form.email && form.cellphone;
    }
    if (step === 3) {
      return form.eps.name && form.eps.type;
    }
    return true;
  }, [step, form]);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setStep(0);
    setProfOpen(false);
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
              <div>
                <label className={labelBase}>
                  Tipo de documento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="typeDocument"
                    value={form.typeDocument}
                    onChange={handleChange}
                    className={`${fieldBase} appearance-none`}
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
                  inputMode="text"
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
                    name="bloodType"
                    value={form.bloodType}
                    onChange={handleChange}
                    className={`${fieldBase} appearance-none`}
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

              {/* Profesión con autocompletado */}
              <div className="relative">
                <label className={labelBase}>
                  Profesión <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={form.profession}
                  onChange={(e) => {
                    handleChange(e);
                    setProfOpen(true);
                  }}
                  onFocus={() => setProfOpen(true)}
                  onBlur={() => setTimeout(() => setProfOpen(false), 120)}
                  placeholder="Escribe para buscar…"
                  className={`${fieldBase.replace("bg-white", "bg-white")} !pr-3`}
                  autoComplete="off"
                  required
                />
                {profOpen && (
                  <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white/95 shadow-xl backdrop-blur">
                    {profSuggestions.length > 0 ? (
                      profSuggestions.map((p) => (
                        <li
                          key={p}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectProfession(p)}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                        >
                          {p}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-xs text-gray-500">
                        Sin coincidencias
                      </li>
                    )}
                    {!profSuggestions.includes(form.profession) &&
                      form.profession.trim() !== "" && (
                        <li className="px-3 py-2 text-xs text-gray-500 border-t">
                          Usar “{form.profession}”
                        </li>
                      )}
                  </ul>
                )}
              </div>
              <div>
                <label className={labelBase}>Estado</label>
                <div className="relative">
                  <select
                    name="state"
                    value={form.state}
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
                  name="bornDate"
                  value={form.bornDate}
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
                <label className={labelBase}>Departamento</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  readOnly
                  className={`${fieldBase} bg-gray-50`}
                />
              </div>
              <div>
                <label className={labelBase}>
                  Ciudad / Municipio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={`${fieldBase} appearance-none`}
                    required
                  >
                    <option value="" disabled>
                      Seleccione…
                    </option>
                    {MUNICIPALITIES_BOYACA.map((m) => (
                      <option key={m} value={m}>
                        {m}
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
                  value={form.zone}
                  onChange={handleChange}
                  className={fieldBase}
                />
              </div>

              <div className="md:col-span-3">
                <label className={labelBase}>
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
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
                  name="cellphone"
                  value={form.cellphone}
                  onChange={handleChange}
                  className={fieldBase}
                  required
                />
              </div>
              <div>
                <label className={labelBase}>URL Foto </label>
                <input
                  type="url"
                  name="picture"
                  value={form.picture}
                  onChange={handleChange}
                  placeholder="https://…"
                  className={fieldBase}
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
                        name="name"
                        value={form.eps.name}
                        onChange={(e) => handleNested("eps", e)}
                        className={`${fieldBase} appearance-none`}
                      >
                        <option value="" disabled>
                          Seleccione…
                        </option>
                        {EPS_CO.map((e) => (
                          <option key={e} value={e}>
                            {e}
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
                        name="type"
                        value={form.eps.type}
                        onChange={(e) => handleNested("eps", e)}
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
                      <strong>Tipo Doc:</strong> {form.typeDocument}
                    </li>
                    <li>
                      <strong>Documento:</strong> {form.document}
                    </li>
                    <li>
                      <strong>N° Carnet:</strong> {form.carnet || "-"}
                    </li>
                    <li>
                      <strong>Sangre:</strong> {form.bloodType}
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
                      <strong>Profesión:</strong> {form.profession || "—"}
                    </li>
                    <li>
                      <strong>Estado:</strong> {form.state}
                    </li>
                    <li>
                      <strong>Fecha de nacimiento:</strong> {form.bornDate}
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Ubicación & Contacto
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Depto/Ciudad:</strong> {form.department} /{" "}
                      {form.city}
                    </li>
                    <li>
                      <strong>Dirección:</strong> {form.address}
                    </li>
                    <li>
                      <strong>Celular:</strong> {form.cellphone}
                    </li>
                    <li>
                      <strong>Email:</strong> {form.email}
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <h5 className="font-medium text-gray-800 mb-2">
                    EPS & Emergencia
                  </h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>EPS:</strong> {form.eps.name || "—"} (
                      {form.eps.type || "—"})
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
