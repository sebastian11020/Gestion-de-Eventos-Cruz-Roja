"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/cards/eventCard";
import Modal from "@/components/layout/modal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  History,
  PlusCircle,
  Loader2,
  ScanLine,
} from "lucide-react";
import type {assistantEvent, event as EventType} from "@/types/usertType";
import CreateEventForm from "@/components/forms/createEventForm";
import { PAGE_SIZE } from "@/const/consts";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { useEventData } from "@/hooks/useEventData";
import toast from "react-hot-toast";
import { inscribeEvent } from "@/services/serviceGetEvent";
import { ReadQrDialog } from "@/components/layout/readQrDialog";
import {getAssistEvent, removeAssistEvent} from "@/services/serviceGetPerson";
import AssistantsDialog from "@/components/tables/assistantsDialog";

function asDateRange(e: Pick<EventType, "startDate" | "endDate">) {
  if (e.startDate && e.endDate) return `${e.startDate} – ${e.endDate}`;
  return e.startDate ?? e.endDate ?? "";
}

function normalizeStatus(raw: unknown): string {
  const s =
    (typeof raw === "string" && raw) ||
    (raw && typeof (raw as any).name === "string" && (raw as any).name) ||
    (raw && typeof (raw as any).code === "string" && (raw as any).code) ||
    "";
  return s.toString().trim().toUpperCase();
}
function getEventStatus(e: any): string {
  return normalizeStatus(
    e?.state ??
      e?.eventStatus?.state ??
      e?.eventStatus ??
      e?.event_status?.state ??
      e?.event_status,
  );
}
function getEndAt(e: any): string | undefined {
  return (
    e?.startAt || e?.endAt || e?.endDate || e?.end_date || e?.estimated_end_date
  );
}
function isDatePast(iso?: string) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}
function isHistoryEvent(e: any) {
  const status = getEventStatus(e);
  const endAt = getEndAt(e);
  const FINISHED = ["FINALIZADO", "FINALIZED"];
  const CANCELED = ["CANCELADO", "CANCELED", "CANCELLED"];
  const ONGOING = ["EN CURSO", "ONGOING", "IN_PROGRESS", "EN_CURSO"];
  if (FINISHED.includes(status) || CANCELED.includes(status)) return true;
  const endedByTime = isDatePast(endAt);
  const isOngoing = ONGOING.includes(status);
  if (endedByTime && !isOngoing) return true;
  return false;
}

function EventCardSkeleton() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
      <div className="h-5 w-3/4 rounded bg-gray-200 mb-2" />
      <div className="h-4 w-1/2 rounded bg-gray-200 mb-4" />
      <div className="h-3 w-full rounded bg-gray-200 mb-2" />
      <div className="h-3 w-5/6 rounded bg-gray-200 mb-2" />
      <div className="h-3 w-4/6 rounded bg-gray-200 mb-6" />
      <div className="flex gap-2">
        <div className="h-9 w-24 rounded-xl bg-gray-200" />
        <div className="h-9 w-28 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function EventosPage() {
  const { sectionals, cities } = useSectionalsNode();
  const [page, setPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [assistant,setAssistant] = useState<assistantEvent[]>([]);
    const [assistOpen, setAssistOpen] = useState(false);
    const [assistLoading, setAssistLoading] = useState(false);
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);


    const { events, reload, skills, loading } = useEventData();

  const filtered = useMemo(
    () =>
      events.filter((e) =>
        showHistory ? isHistoryEvent(e) : !isHistoryEvent(e),
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

  async function handleSubscribe(eventId: string, idSkill: string) {
    try {
      await toast.promise(
        inscribeEvent(eventId, idSkill).then((res) => {
          if (!res.success) return Promise.reject(res);
          return res;
        }),
        {
          loading: "Inscribiendo a evento...",
          success: (res: { message?: string }) => (
            <b>{res.message ?? "Inscrito correctamente"}</b>
          ),
          error: (res: { message?: string }) => (
            <b>{res.message ?? "No se pudo inscribir"}</b>
          ),
        },
      );
      await reload();
    } catch (error) {
      console.error(error);
    }
  }

    async function hanleViewEnrolled(id: string) {
        try {
            setAssistLoading(true);
            setCurrentEventId(id);
            const response = await getAssistEvent(id);
            setAssistant(response);
            setAssistOpen(true);
        } catch (e) {
            console.error(e);
            toast.error("No se pudieron cargar los asistentes");
        } finally {
            setAssistLoading(false);
        }
    }

    async function handleRemoveAssistant(document: string) {
        if (!currentEventId) return;
        const res = await removeAssistEvent(currentEventId, document);
        if (!res?.success) throw new Error(res?.message ?? "Error");
        setAssistant((prev) => prev.filter((a) => a.document !== document));
    }

  return (
    <div className="p-6 space-y-6">
      {/* Barra superior */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          Eventos
        </h1>

        <div className="flex items-center gap-2">
          {/* 🟨 Botón Leer QR */}
          <Button
            type="button"
            onClick={() => setQrOpen(true)}
            disabled={loading}
            className="
              flex items-center gap-2 rounded-xl
              bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 hover:shadow-md
              transition-all duration-200 ease-in-out
              focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            "
            title="Leer QR para registrar asistencia"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ScanLine className="w-4 h-4" />
            )}
            Leer QR
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowHistory((v) => !v)}
            disabled={loading}
            className={`
              flex items-center gap-2 rounded-xl border-2 
              border-gray-300 text-gray-700 font-medium
              hover:bg-gray-100 hover:text-blue-700 hover:border-blue-400
              active:scale-[0.97]
              transition-all duration-200 ease-in-out
              focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            `}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <History className="w-4 h-4" />
            )}
            {showHistory ? "Ver próximos" : "Ver historial"}
          </Button>

          <Button
            type="button"
            onClick={() => setOpenCreate(true)}
            disabled={loading}
            className="
              flex items-center gap-2 rounded-xl
              bg-blue-600 text-white font-medium
              hover:bg-blue-700 hover:shadow-md
              transition-all duration-200 ease-in-out
              focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            "
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            Crear evento
          </Button>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <EventCardSkeleton key={`skeleton-${i}`} />
            ))
          : pageSlice.map((e, idx) => {
              const composedDate = (e as any).date ?? asDateRange(e);
              const id = (e as any).id ?? String((page - 1) * PAGE_SIZE + idx);
              return (
                <EventCard
                  id={e.id ?? ""}
                  key={e.id}
                  title={e.title}
                  streetAddress={e.streetAddress}
                  leader={e.leader}
                  description={e.description}
                  date={composedDate}
                  location={e.location}
                  capacity={e.capacity as any}
                  isInscrit={e.is_participant}
                  isLeader={e.is_leader}
                  state={e.state}
                  skillQuotas={e.skill_quota}
                  skillsUser={skills}
                  showSuscribe={!showHistory}
                  onDelete={reload}
                  onSubscribe={(skillId) => handleSubscribe(id, skillId)}
                  onViewEnrolled={() => hanleViewEnrolled(e.id ?? '')}
                />
              );
            })}

        {!loading && pageSlice.length === 0 && (
          <div className="col-span-full text-sm text-gray-600">
            {showHistory
              ? "No hay eventos en el historial."
              : "No hay eventos próximos."}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {loading
            ? "Cargando eventos…"
            : `Mostrando ${showingFrom}–${showingTo} de ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 rounded-xl"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || page === 1}
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
            disabled={loading || page === totalPages}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modal crear */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Crear evento"
      >
        <CreateEventForm
          onCancel={() => setOpenCreate(false)}
          onSuccess={() => setOpenCreate(false)}
          cities={cities}
          onReload={reload}
          sectionals={sectionals}
        />
      </Modal>

      <ReadQrDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        apiBase={process.env.NEXT_PUBLIC_API_URL || ""}
      />

        <AssistantsDialog
            open={assistOpen}
            onClose={() => setAssistOpen(false)}
            assistants={assistant}
            loading={assistLoading}
            onRemove={handleRemoveAssistant}
            title="Asistentes del evento"
        />

    </div>
  );
}
