// app/dashboard/eventos/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EventCard } from "@/components/layout/eventCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History, PlusCircle } from "lucide-react";
import type { event as EventType } from "@/types/usertType";
import Podium from "@/components/layout/podium";

const PAGE_SIZE = 8;

type TopVolunteer = { id: string; name: string; hours: number };

function asDateRange(e: Pick<EventType, "startDate" | "endDate">) {
    if (e.startDate && e.endDate) return `${e.startDate} – ${e.endDate}`;
    return e.startDate ?? e.endDate ?? "";
}

function isPast(startAt?: string) {
    if (!startAt) return false;
    const now = new Date();
    return new Date(startAt).getTime() < now.getTime();
}

export default function EventosPage() {
    const events: EventType[] = [
        {
            id: "1",
            title: "Capacitación en Primeros Auxilios",
            description:
                "Aprende técnicas básicas de primeros auxilios con instructores certificados.",
            startDate: "15 Octubre 2025, 10:00 AM",
            endDate: "15 Octubre 2025, 12:00 PM",
            location: "Seccional Tunja",
            capacity: "30",
            startAt: "2025-10-15T15:00:00.000Z",
        },
        {
            id: "2",
            title: "Jornada de Donación de Sangre",
            description: "Participa en nuestra jornada de donación y ayuda a salvar vidas.",
            startDate: "20 Octubre 2025, 8:00 AM",
            endDate: "",
            location: "Hospital Regional",
            capacity: "30",
            startAt: "2025-10-20T13:00:00.000Z",
        },
        {
            id: "3",
            title: "Simulacro de Evacuación",
            description: "Práctica de rutas de evacuación en la sede municipal.",
            startDate: "01 Septiembre 2025, 9:00 AM",
            endDate: "01 Septiembre 2025, 10:30 AM",
            location: "Unidad Municipal",
            capacity: "50",
            // Pasado
            startAt: "2025-09-01T14:00:00.000Z",
        },
    ];

    // 🔹 Podio (mock). En producción: GET /reports/top-volunteers?month=YYYY-MM
    const topVolunteers: TopVolunteer[] = [
        { id: "u1", name: "Ana Rodríguez", hours: 42 },
        { id: "u2", name: "Carlos Pérez", hours: 36 },
        { id: "u3", name: "Luisa Gómez", hours: 29 },
    ];

    const [page, setPage] = useState(1);
    const [showHistory, setShowHistory] = useState(false);

    const filtered = useMemo(() => {
        return events.filter((e) => (showHistory ? isPast((e as any).startAt) : !isPast((e as any).startAt)));
    }, [events, showHistory]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
        [filtered.length]
    );

    const pageSlice = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return filtered.slice(start, end);
    }, [filtered, page]);

    const showingFrom = useMemo(
        () => (filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1),
        [filtered.length, page]
    );
    const showingTo = useMemo(
        () => Math.min(page * PAGE_SIZE, filtered.length),
        [filtered.length, page]
    );

    const handleSubscribe = (eventId: string) => {
        console.log("Inscrito en evento", eventId);
    };


    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                    Eventos
                </h1>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setShowHistory((v) => !v)}
                    >
                        <History className="w-4 h-4 mr-2" />
                        {showHistory ? "Ver próximos" : "Ver historial"}
                    </Button>

                    {/* Crear evento */}
                    <Link href="/dashboard/eventos/crear">
                        <Button type="button" className="rounded-xl">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Crear evento
                        </Button>
                    </Link>
                </div>
            </div>

            <Podium top={topVolunteers}></Podium>

            {/* Grid de tarjetas */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageSlice.map((e, idx) => {
                    const composedDate = (e as any).date ?? asDateRange(e);
                    const id = (e as any).id ?? String((page - 1) * PAGE_SIZE + idx);
                    return (
                        <EventCard
                            key={id}
                            title={e.title}
                            description={e.description}
                            date={composedDate}
                            location={e.location}
                            capacity={e.capacity as any}
                            showSuscribe={!showHistory}
                            onSubscribe={() => handleSubscribe(id)}
                            onViewEnrolled={() => console.log("Ver inscritos de", id)}
                        />

                    );
                })}
                {pageSlice.length === 0 && (
                    <div className="col-span-full text-sm text-gray-600">
                        {showHistory
                            ? "No hay eventos en el historial."
                            : "No hay eventos próximos."}
                    </div>
                )}
            </div>

            {/* Paginación */}
            <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Mostrando {showingFrom}–{showingTo} de {filtered.length}
        </span>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
