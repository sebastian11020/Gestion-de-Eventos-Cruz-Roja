"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { CalendarCheck, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { FormState } from "@/types/usertType";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { getPersonUpdate } from "@/services/serviceGetPerson";
import { updatePersonProfile } from "@/services/serviceCreatePerson";
import { ReadOnly } from "@/components/layout/ReadOnly";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ajustes",
};

function toNumberHours(v: unknown) {
  const n = parseInt(String(v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [person, setPerson] = useState<FormState | null>(null);
  const { cities, eps } = useSectionalsNode();
  const [phone, setPhone] = useState<string>("");
  const [ecName, setEcName] = useState<string>("");
  const [ecRelation, setEcRelation] = useState<string>("");
  const [ecPhone, setEcPhone] = useState<string>("");

  const [streetAddress, setStreetAddress] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [cityId, setCityId] = useState<string | "">("");

  const [epsId, setEpsId] = useState<string | "">("");
  const [typeAffiliation, setTypeAffiliation] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const sb = supabase();
        const {
          data: { session },
        } = await sb.auth.getSession();

        const token = session?.access_token;
        if (!token) {
          toast.error("No hay sesión activa");
          setLoading(false);
          return;
        }
        const response = await getPersonUpdate();
        const data: FormState = response.leader;
        setPerson(data);
        setPhone(data.cellphone ?? "");
        setEcName(data.emergencyContact?.name ?? "");
        setEcRelation(data.emergencyContact?.relationShip ?? "");
        setEcPhone(data.emergencyContact?.phone ?? "");
        setStreetAddress(data.address ?? data?.address ?? "");
        setZone(data.zone ?? "");
        if (data.eps?.id) {
          setEpsId(data.eps.id);
        }
        if (data.city?.id) {
          setCityId(data.city.id);
        }
        setTypeAffiliation(data.eps?.type ?? "");
      } catch (err) {
        console.error(err);
        toast.error("Error cargando el perfil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const sb = supabase();
      const {
        data: { session },
      } = await sb.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Sesión no válida");
      if (!cityId) {
        toast.error("Selecciona un municipio");
        return;
      }
      if (!epsId) {
        toast.error("Selecciona una EPS");
        return;
      }
      const payload = {
        phone: Number(phone || 0),
        emergencyContact: {
          name: ecName,
          relationShip: ecRelation,
          phone: Number(ecPhone || 0),
        },
        address: {
          streetAddress: streetAddress,
          zone: zone,
        },
        id_location: Number(cityId),
        id_eps: Number(epsId),
        type_affiliation: typeAffiliation, // si tienes catálogo fijo, reemplázalo por un select.
      };
      const response = await updatePersonProfile(payload);
      if (response.success) {
        toast.success(response.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Error al actualizar");
    } finally {
      setSaving(false);
    }
  }

  const monthHoursNum = toNumberHours(person?.monthHours);
  const monthIconClasses =
    monthHoursNum < 5
      ? "bg-red-50 ring-1 ring-red-200 text-red-600"
      : monthHoursNum < 12
        ? "bg-amber-50 ring-1 ring-amber-200 text-amber-600"
        : "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-600";

  const monthValueColor =
    monthHoursNum < 5
      ? "text-red-700"
      : monthHoursNum < 12
        ? "text-amber-700"
        : "text-emerald-700";
  return (
    <div className="p-6 space-y-6">
      {/* RESUMEN DE HORAS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Horas del mes con umbrales de color */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 place-items-center rounded-lg ${monthIconClasses}`}
            >
              {/* El ícono adopta el color del círculo, el valor va con color numérico */}
              <CalendarCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Horas del mes</p>
              <p className={`text-2xl font-semibold ${monthValueColor}`}>
                {person?.monthHours ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Horas históricas (estilo neutro) */}
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-50 ring-1 ring-blue-200 text-blue-600">
              <Clock3 className="size-5" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Horas históricas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {person?.totalHours ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSave}
        className="grid gap-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900">Mi información</h2>

        {/* SOLO LECTURA */}
        <div className="grid gap-4 md:grid-cols-2">
          <ReadOnly label="Tipo documento" value={person?.typeDocument} />
          <ReadOnly label="Documento" value={person?.document} />
          <ReadOnly label="Carnet" value={person?.carnet} />
          <ReadOnly label="Nombre" value={person?.name} />
          <ReadOnly label="Apellido" value={person?.lastName} />
          <ReadOnly label="Tipo de sangre" value={person?.bloodType} />
          <ReadOnly label="Sexo" value={person?.sex} />
          <ReadOnly label="Género" value={person?.gender} />
          <ReadOnly label="Correo" value={person?.email} />
          <ReadOnly label="Sede/Seccional" value={person?.sectional?.city} />
          <ReadOnly
            label="Agrupación / Programa"
            value={
              [person?.group?.name, person?.group?.program?.name]
                .filter(Boolean)
                .join(" / ") || undefined
            }
          />
        </div>

        <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* EDITABLES */}
        <h3 className="text-base font-semibold text-gray-900">
          Datos editables
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Teléfono */}
          <Field label="Celular" htmlFor="phone">
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="3001234567"
            />
          </Field>

          {/* EPS */}
          <Field label="EPS" htmlFor="eps">
            <select
              id="eps"
              value={epsId}
              onChange={(e) => setEpsId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
            >
              <option value="">Seleccione EPS</option>
              {eps.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Tipo afiliación */}
          <Field label="Tipo de afiliación" htmlFor="typeAff">
            <input
              id="typeAff"
              type="text"
              value={typeAffiliation}
              onChange={(e) => setTypeAffiliation(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="Contributivo, Subsidiado, etc."
            />
          </Field>

          {/* Dirección */}
          <Field label="Dirección (calle y número)" htmlFor="streetAddress">
            <input
              id="streetAddress"
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="Calle 12 # 34 - 56"
            />
          </Field>

          <Field label="Zona / Barrio / Vereda" htmlFor="zone">
            <input
              id="zone"
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="Zona / barrio"
            />
          </Field>

          {/* Municipio */}
          <Field label="Municipio" htmlFor="city">
            <select
              id="city"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200
                       disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Seleccione municipio</option>
              {cities?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Contacto de emergencia */}
          <Field label="Contacto de emergencia - Nombre" htmlFor="ecn">
            <input
              id="ecn"
              type="text"
              value={ecName}
              onChange={(e) => setEcName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="Nombre"
            />
          </Field>

          <Field label="Contacto de emergencia - Parentesco" htmlFor="ecr">
            <input
              id="ecr"
              type="text"
              value={ecRelation}
              onChange={(e) => setEcRelation(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="Madre, Padre, Cónyuge, etc."
            />
          </Field>

          <Field label="Contacto de emergencia - Teléfono" htmlFor="ecp">
            <input
              id="ecp"
              type="tel"
              inputMode="numeric"
              value={ecPhone}
              onChange={(e) => setEcPhone(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition
                       hover:border-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              placeholder="3001234567"
            />
          </Field>
        </div>

        {/* AYUDA VISUAL */}
        <div className="flex items-start gap-3 rounded-lg bg-blue-50/60 p-3 text-sm text-blue-900 ring-1 ring-blue-200">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            Solo puedes editar <b>celular</b>, <b>EPS</b>,{" "}
            <b>tipo de afiliación</b>, <b>dirección</b>, <b>zona</b>,{" "}
            <b>municipio</b> y <b>contacto de emergencia</b>. Los demás campos
            son informativos.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400"
            disabled={saving || loading}
          >
            Descartar cambios
          </button>
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60"
            disabled={saving || loading}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* LOADING SIMPLE */}
      {loading && (
        <div className="text-sm text-gray-500">Cargando perfil...</div>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5" htmlFor={htmlFor}>
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}
