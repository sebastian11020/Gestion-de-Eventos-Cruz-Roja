"use client";

import { Crown, Medal, Trophy } from "lucide-react";

type TopVolunteer = { id: string; name: string; hours: number; avatarUrl?: string };

export default function Podium({ top }: { top: TopVolunteer[] }) {
    const gold = top?.[0];
    const silver = top?.[1];
    const bronze = top?.[2];

    const Avatar = ({ name, url }: { name?: string; url?: string }) => (
        <div className="relative h-9 w-9 rounded-full ring-2 ring-white/70 shadow">
            {url ? (
                <img src={url} alt={name ?? "avatar"} className="h-9 w-9 rounded-full object-cover" />
            ) : (
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {(name ?? "-")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                </div>
            )}
        </div>
    );

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
            {/* badge superior */}
            <div className="absolute top-1.5 right-1.5">
                {place === "1" ? (
                    <Crown className="w-5 h-5 drop-shadow" />
                ) : (
                    <Medal className={`w-5 h-5 ${medalColor} drop-shadow`} />
                )}
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center gap-1 pb-3 pt-4">
                <Avatar name={person?.name} url={person?.avatarUrl} />
                <div className="text-center">
                    <div className="text-xs opacity-90">{place}º lugar</div>
                    <div className="font-semibold text-sm">{person?.name ?? "-"}</div>
                    <div className="text-xs opacity-90 flex items-center justify-center gap-1">
                        <Trophy className="w-3 h-3" /> {person?.hours ?? 0}h
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section aria-label="Top voluntarios del mes" className="w-full">
            <div className="mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <h2 className="text-base font-semibold text-gray-800">Top voluntarios del mes</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {/* Plata */}
                <Card
                    place="2"
                    person={silver}
                    py="py-6"
                    accent="bg-gradient-to-br from-slate-400 to-slate-600"
                    medalColor="text-slate-100"
                />
                {/* Oro */}
                <div className="-mt-2">
                    <Card
                        place="1"
                        person={gold}
                        py="py-8"
                        accent="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500"
                        medalColor="text-yellow-100"
                    />
                </div>
                {/* Bronce */}
                <Card
                    place="3"
                    person={bronze}
                    py="py-5"
                    accent="bg-gradient-to-br from-amber-700 to-orange-800"
                    medalColor="text-orange-100"
                />
            </div>
        </section>
    );
}
