"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/cards/eventCard";
import Modal from "@/components/layout/modal";
import Podium from "@/components/layout/podium";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History, PlusCircle } from "lucide-react";
import type { event as EventType } from "@/types/usertType";
import CreateEventForm from "@/components/forms/createEventForm";

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
    // ... tus mocks
  ];

  const topVolunteers: TopVolunteer[] = [
    // ... tus mocks
  ];

  const [page, setPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  // 🔹 estado para abrir/cerrar el modal de crear
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = useMemo(
    () =>
      events.filter((e) =>
        showHistory ? isPast((e as any).startAt) : !isPast((e as any).startAt),
      ),
    [events, showHistory],
  );
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length],
  );
  const pageSlice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, page]);

  const showingFrom = useMemo(
    () => (filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1),
    [filtered.length, page],
  );
  const showingTo = useMemo(
    () => Math.min(page * PAGE_SIZE, filtered.length),
    [filtered.length, page],
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

          {/* 👉 Abre modal de crear */}
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => setOpenCreate(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear evento
          </Button>
        </div>
      </div>

      <Podium top={topVolunteers} />

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

      {/* Modal con el formulario de crear evento */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Crear evento"
      >
        <CreateEventForm
          onCancel={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
          }}
        />
      </Modal>
    </div>
  );
}
