"use client";

import { Crown, Medal, Trophy } from "lucide-react";

export type TopVolunteer = {
  name: string;
  hours: number;
};

export default function PodiumTop({
  top,
  showPodium = true,
  showTopList = true,
  title = "Top voluntarios del mes",
}: {
  top: TopVolunteer[];
  showPodium?: boolean;
  showTopList?: boolean;
  title?: string;
}) {
  const list = Array.isArray(top) ? top.slice(0, 10) : [];

  const Card = ({
    place,
    person,
    accent,
    py,
    medalColor,
  }: {
    place: "1" | "2" | "3";
    person?: TopVolunteer;
    accent: string;
    py: string;
    medalColor: string;
  }) => (
    <div
      className={`relative rounded-xl shadow-md ${accent} text-white flex flex-col items-center justify-end ${py} overflow-hidden`}
      aria-label={`Puesto ${place}`}
    >
      <div className="absolute top-1.5 right-1.5">
        {place === "1" ? (
          <Crown className="w-5 h-5 drop-shadow" />
        ) : (
          <Medal className={`w-5 h-5 ${medalColor} drop-shadow`} />
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1 pb-3 pt-4">
        <div className="text-center px-2">
          <div className="text-xs opacity-90">{place}º lugar</div>
          <div
            className="font-semibold text-sm max-w-[220px] truncate"
            title={person?.name}
          >
            {person?.name ?? "-"}
          </div>
          <div className="text-xs opacity-90 flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3" /> {person?.hours ?? 0}h
          </div>
        </div>
      </div>
    </div>
  );

  if (!showPodium && !showTopList) return null;

  return (
    <section aria-label="Top voluntarios del mes" className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <Crown className="w-4 h-4 text-yellow-500" />
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>

      {/* PODIO (estilo original) */}
      {showPodium && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            {/* Plata */}
            <Card
              place="2"
              person={list[1]}
              py="py-6"
              accent="bg-gradient-to-br from-slate-400 to-slate-600"
              medalColor="text-slate-100"
            />
            {/* Oro */}
            <div className="-mt-2">
              <Card
                place="1"
                person={list[0]}
                py="py-8"
                accent="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500"
                medalColor="text-yellow-100"
              />
            </div>
            {/* Bronce */}
            <Card
              place="3"
              person={list[2]}
              py="py-5"
              accent="bg-gradient-to-br from-amber-700 to-orange-800"
              medalColor="text-orange-100"
            />
          </div>
        </div>
      )}

      {/* TABLA (mejorada) */}
      {showTopList && (
        <div className="mt-4">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Top 10</h3>
                <p className="text-xs text-gray-500">
                  Horas acumuladas del mes
                </p>
              </div>
              {list.length > 0 && (
                <div className="text-[11px] text-gray-500">
                  {list.length} registros
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium w-16">#</th>
                    <th className="px-4 py-2 text-left font-medium">Nombre</th>
                    <th className="px-4 py-2 text-right font-medium w-24">
                      Horas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No hay datos disponibles.
                      </td>
                    </tr>
                  ) : (
                    list.map((p, idx) => (
                      <tr
                        key={`${p.name}-${idx}`}
                        className="border-top border-gray-100 hover:bg-gray-50/70"
                        style={{ borderTopWidth: 1 }}
                      >
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                              idx === 0
                                ? "bg-amber-100 text-amber-700"
                                : idx === 1
                                  ? "bg-slate-100 text-slate-700"
                                  : idx === 2
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                            aria-label={`Posición ${idx + 1}`}
                            title={`Posición ${idx + 1}`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td
                          className="px-4 py-2 max-w-[520px] truncate"
                          title={p.name}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-700 ring-1 ring-gray-200">
                              {getInitials(p.name)}
                            </div>
                            <span className="truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right font-semibold tabular-nums">
                          {p.hours}h
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function getInitials(name?: string) {
  if (!name) return "--";
  const parts = name.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}
