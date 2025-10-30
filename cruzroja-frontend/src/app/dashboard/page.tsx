// Dashboard.tsx
"use client";

import { Card } from "@/components/cards/InformationCard";
import {
    Users,
    CalendarCheck2,
    HardHat,
    ClipboardList,
    BicepsFlexed,
} from "lucide-react";
import Image from "next/image";
import EventsCalendar from "@/calendar/EventsCalendar";
import Link from "next/link";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect, useMemo, useState } from "react";
import PodiumTop, { TopVolunteer } from "@/components/layout/podium";

export default function Dashboard() {
    const { events, cards, top } = useDashboardData();
    const [isVolunteer, setIsVolunteer] = useState<boolean | null>(null); // null = aún no sabemos
    const [roleReady, setRoleReady] = useState(false);

    useEffect(() => {
        try {
            const role = localStorage.getItem("role");
            setIsVolunteer(role === "VOLUNTARIO");
        } catch {
            setIsVolunteer(false);
        } finally {
            setRoleReady(true);
        }
    }, []);

    const topList: TopVolunteer[] = useMemo(() => {
        if (!Array.isArray(top)) return [];
        return top
            .map((t: any) => ({
                name: String(t?.name ?? "-"),
                hours: Number(t?.hours_month ?? 0), // <- convertir string a número
            }))
            .filter((t) => t.name && !Number.isNaN(t.hours))
            .sort((a, b) => b.hours - a.hours)   // opcional: asegurar orden desc
            .slice(0, 10);
    }, [top]);

    if (!roleReady) {
        return (
            <div className="p-4 sm:p-6 lg:p-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-4">
                    Dashboard
                </h1>
                <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
            </div>
        );
    }

    // ---- Vista exclusiva para VOLUNTARIO: solo podio + top ----
    if (isVolunteer) {
        return (
            <div className="p-4 sm:p-6 lg:p-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-4">
                    Dashboard
                </h1>

                {/* Solo podio + top (podio visible y lista Top10 visible) */}
                <PodiumTop top={topList} showPodium={true} showTopList={true} />
            </div>
        );
    }

    // ---- Vista para NO voluntario: tarjetas + calendario (sin podio/top) ----
    return (
        <div className="p-4 sm:p-6 lg:p-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-4">
                Dashboard
            </h1>

            {/* Tarjetas */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/voluntarios">
                    <Card
                        title="Usuarios Totales"
                        content={cards?.total_user}
                        icon={<Users className="size-6" />}
                        className="bg-blue-100 text-blue-500"
                    />
                </Link>

                <Link href="/dashboard/sedes">
                    <Card
                        title="Lider Seccional"
                        content={cards?.leader}
                        icon={<Image src="/4792929.png" alt="Foto de perfil" width={50} height={50} />}
                    />
                </Link>

                <Link href="/dashboard/agrupaciones">
                    <Card
                        title="Coordinadores de Agrupación"
                        content={cards?.total_coordinators_group}
                        icon={<HardHat className="size-6" />}
                        className="bg-yellow-100 text-yellow-500"
                    />
                </Link>

                <Link href="/dashboard/programas">
                    <Card
                        title="Coordinadores de Programa"
                        content={cards?.total_coordinators_program}
                        icon={<ClipboardList className="size-6" />}
                        className="bg-amber-100 text-amber-800"
                    />
                </Link>

                <Link href="/dashboard/voluntarios">
                    <Card
                        title="Total Voluntarios"
                        content={cards?.total_volunteers}
                        icon={<BicepsFlexed className="size-6" />}
                        className="bg-pink-100 text-pink-500"
                    />
                </Link>

                <Link href="/dashboard/eventos">
                    <Card
                        title="Eventos Activos"
                        content={cards?.active_events}
                        icon={<CalendarCheck2 className="size-6" />}
                        className="bg-green-100 text-green-500"
                    />
                </Link>
            </div>

            {/* Calendario */}
            <div className="mt-6 sm:mt-8 hidden md:block">
                <EventsCalendar events={events} initialView="dayGridMonth" height={500} />
            </div>
        </div>
    );
}
