import { FormState } from "@/types/usertType";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  Droplet,
  IdCard,
  User2,
  MapPin,
  Home,
  Hash,
  ShieldCheck,
  X,
  Flame,
  CalendarClock,
    HardHat,
    Siren,
    BriefcaseBusiness
} from "lucide-react";
import { CardBlock } from "@/components/ui/cardBlock";
import { DL } from "@/components/ui/dl";

type viewUserProps = {
  infUser: FormState | null;
  onClose: () => void;
};

function calcAgeFromDate(bornDate?: string) {
  if (!bornDate) return undefined;
  const [y, m, d] = bornDate.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  if (mm < m || (mm === m && dd < d)) age--;
  return age;
}

function badgeClass(state: string | undefined) {
  const s = state?.toLowerCase();
  if (s === "activo")
    return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
  if (s === "licencia")
    return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
  if (s === "desvinculado")
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  if (s === "inactivo")
    return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  if (s === "formacion") return "bg-sky-100 text-sky-700 ring-1 ring-sky-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

function badgeHours(monthHours: string | undefined) {
  let s = 0;
  if (monthHours != undefined) {
    s = parseInt(monthHours);
  }
  if (s <= 5) return "bg-red-100 text-red-700 ring-1 ring-red-200";
  if (s > 5 && s <= 11)
    return "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
  if (s >= 12) return "bg-green-100 text-green-700 ring-1 ring-green-200";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export default function ViewUser({ infUser, onClose }: viewUserProps) {
  const [data, setData] = useState<FormState>();
  useEffect(() => {
    if (infUser) setData(infUser);
  }, [infUser]);

  if (!infUser) return null;

  const age = calcAgeFromDate(data?.bornDate);
  const fullName = `${data?.name} ${data?.lastName}`.trim();
  const photo =
    data?.picture && data?.picture !== "#" ? data?.picture : "/4792929.png";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto md:overflow-hidden ">
      {/* overlay + blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal glassy */}
      <div className="relative z-[101] w-[96vw] max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl bg-white/90 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:overflow-hidden  max-h-[90vh] overflow-y-auto">
        {/* header degradado */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 opacity-90" />
          {/* sutil patrón */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative flex items-center justify-between px-6 py-4">
            <h2 className="text-base md:text-lg font-semibold text-white tracking-tight">
              Detalle del voluntario
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white transition"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* contenido */}
        <section className="p-6">
          {/* Encabezado con avatar destacado */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl ring-2 ring-white shadow-lg">
                <Image
                  src={photo}
                  alt={`Foto de ${fullName || "voluntario"}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                {/* brillo suave */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {fullName || "Voluntario"}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${badgeClass(
                      data?.state,
                    )}`}
                  >
                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                    {data?.state}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
                    <Droplet className="mr-1.5 h-4 w-4" />
                    {data?.bloodType || "—"}
                  </span>
                  {age !== undefined && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
                      <User2 className="mr-1.5 h-4 w-4" />
                      {age} años
                    </span>
                  )}
                  {data?.profession && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
                        <BriefcaseBusiness className="mr-1.5 h-4 w-4" />
                      {data?.profession}
                    </span>
                  )}
                  {data?.totalHours && (
                    <span className="inline-flex items-center rounded-full bg-red-300 px-3 py-1 font-medium text-red-600 ring-1 ring-slate-200">
                      <Flame className="mr-1.5 h-4 w-4 text-red-500"></Flame>
                      {data?.totalHours}
                    </span>
                  )}
                  {data?.monthHours && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${badgeHours(
                        data?.monthHours,
                      )}`}
                    >
                      <CalendarClock className="mr-1.5 h-4 w-4"></CalendarClock>
                      {data?.monthHours}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contacto breve */}
            <div className="grid gap-2 text-sm md:text-base md:w-auto">
              <a
                href={`mailto:${data?.email}`}
                className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
              >
                <Mail className="h-4 w-4" /> {data?.email}
              </a>
              <a
                href={`tel:${data?.cellphone}`}
                className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
              >
                <Phone className="h-4 w-4" /> {data?.cellphone}
              </a>
            </div>
          </div>

          {/* Bloques en grid responsiva, tarjetas con hover */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CardBlock
              title="Identificación"
              icon={<IdCard className="h-4 w-4" />}
            >
              <DL
                items={[
                  ["Documento", `${data?.document}`],
                  ["Tipo de documento", data?.typeDocument],
                  ["N° Carnet", data?.carnet],
                  ["Sexo", data?.sex],
                  ["Fecha de nacimiento", data?.bornDate || "—"],
                ]}
              />
            </CardBlock>

            <CardBlock title="Ubicación" icon={<MapPin className="h-4 w-4" />}>
              <DL
                items={[
                  ["Departamento", data?.department],
                  ["Ciudad", data?.city],
                  ["Barrio/Vereda", data?.zone],
                  ["Dirección", data?.address],
                ]}
              />
            </CardBlock>

            <CardBlock
              title="Contacto de emergencia"
              icon={<Siren className="h-4 w-4" />}
            >
              <DL
                items={[
                  ["Nombre", data?.emergencyContact?.name || "—"],
                  ["Parentesco", data?.emergencyContact?.relationShip || "—"],
                  ["Celular", data?.emergencyContact?.phone || "—"],
                ]}
              />
            </CardBlock>

            <CardBlock title="EPS" icon={<Home className="h-4 w-4" />}>
              <DL
                items={[
                  ["Nombre", data?.eps?.name || "—"],
                  ["Régimen", data?.eps?.type || "—"],
                ]}
              />
            </CardBlock>

            <CardBlock
              title="Información adicional"
              icon={<User2 className="h-4 w-4" />}
            >
              <DL
                items={[
                  ["Profesión", data?.profession],
                  ["Estado", data?.state],
                  ["Tipo de sangre", data?.bloodType],
                ]}
              />
            </CardBlock>
              <CardBlock
                  title="Informacion de voluntariado"
                  icon={<HardHat className="h-4 w-4" />}
              >
                  <DL
                      items={[
                          ["Horas Totales", data?.totalHours],
                          ["Horas Ultimo Mes", data?.monthHours],
                      ]}
                  />
              </CardBlock>
          </div>
        </section>
      </div>
    </div>
  );
}
