"use client";

import {useEffect, useMemo, useState} from "react";
import { EventCard } from "@/components/cards/eventCard";
import Modal from "@/components/layout/modal";
import type {  event as EventType } from "@/types/usertType";
import CreateEventForm from "@/components/forms/createEventForm";
import { PAGE_SIZE } from "@/const/consts";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { useEventData } from "@/hooks/useEventData";
import toast from "react-hot-toast";
import { inscribeEvent } from "@/services/serviceGetEvent";
import { ReadQrDialog } from "@/components/layout/readQrDialog";
import AssistantsDialog from "@/components/tables/assistantsDialog";

import { EventsToolbar } from "@/components/events/EventsToolbar";
import { PaginationBar } from "@/components/events/PaginationBar";
import { EventCardSkeleton } from "@/components/events/EventCardSkeleton";
import { useAssistants } from "@/hooks/useAssistants";

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
    return e?.startAt || e?.endAt || e?.endDate || e?.end_date || e?.estimated_end_date;
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

export default function EventosPage() {
    const { sectionals, cities } = useSectionalsNode();
    const [page, setPage] = useState(1);
    const [showHistory, setShowHistory] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const { events, reload, skills, loading } = useEventData();
    const assistants = useAssistants();


    const filtered = useMemo(
        () =>
            events.filter((e) => (showHistory ? isHistoryEvent(e) : !isHistoryEvent(e))),
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
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);
    if (!role) return null;

    function isLeader() {
        const leaderRoles = ["LIDER SECCIONAL", "LIDER SEDE", "ADMINISTRADOR"];
        return leaderRoles.includes(role ?? "");
    }

    function isCreate() {
        const leaderRoles = ["LIDER SECCIONAL", "LIDER SEDE", "ADMINISTRADOR","COORDINADOR AGRUPACION","COORDINADOR PROGRAMA"];
        return leaderRoles.includes(role ?? "");
    }

    async function handleSubscribe(eventId: string, idSkill: string) {
        try {
            await toast.promise(
                inscribeEvent(eventId, idSkill).then((res) => {
                    if (!res.success) return Promise.reject(res);
                    return res;
                }),
                {
                    loading: "Inscribiendo a evento...",
                    success: (res: { message?: string }) => <b>{res.message ?? "Inscrito correctamente"}</b>,
                    error: (res: { message?: string }) => <b>{res.message ?? "No se pudo inscribir"}</b>,
                },
            );
            await reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Toolbar */}
            <EventsToolbar
                loading={loading}
                isCreate={isCreate()}
                showHistory={showHistory}
                onToggleHistory={() => setShowHistory((v) => !v)}
                onOpenCreate={() => setOpenCreate(true)}
                onOpenQrReader={() => setQrOpen(true)}
            />

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
                                inHistory={showHistory}
                                description={e.description}
                                date={composedDate}
                                city={e.city}
                                department={e.department}
                                capacity={e.capacity as any}
                                isInscrit={e.is_participant}
                                isLeader={e.is_leader}
                                isEdit={isLeader()}
                                state={e.state}
                                skillQuotas={e.skill_quota}
                                startDate={e.startDate}
                                endDate={e.endDate}
                                skillsUser={skills}
                                showSuscribe={!showHistory}
                                onDelete={reload}
                                onSubscribe={(skillId) => handleSubscribe(id, skillId)}
                                onViewEnrolled={() => assistants.openForEvent(e.id ?? "")}
                            />
                        );
                    })}

                {!loading && pageSlice.length === 0 && (
                    <div className="col-span-full text-sm text-gray-600">
                        {showHistory ? "No hay eventos en el historial." : "No hay eventos próximos."}
                    </div>
                )}
            </div>
            <PaginationBar
                loading={loading}
                page={page}
                totalPages={totalPages}
                showingFrom={showingFrom}
                showingTo={showingTo}
                total={filtered.length}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
            <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Crear evento">
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
                open={assistants.open}
                onClose={() => assistants.setOpen(false)}
                assistants={assistants.assistants}
                loading={assistants.loading}
                onRemove={(doc) => assistants.remove(doc)}
                title="Asistentes del evento"
            />
        </div>
    );
}
