"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import { SkillSelectDialog } from "@/components/events/sections/skillSelectDialog";
import { QrDialog } from "@/components/layout/qrDialog";
import { deleteEventService, cancelInscribeEvent } from "@/services/serviceGetEvent";
import type { skillQuota } from "@/types/usertType";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { EventInfo } from "@/components/events/EventInfo";
import { EventActions } from "@/components/events/EventActions";
import { getFlags } from "@/utils/eventStatus";
import { useEventQr } from "@/hooks/useEventQr";
type Props = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    state: string;
    leader: { id: string; name: string };
    isLeader: boolean;
    isInscrit: boolean;
    streetAddress: string;
    showSuscribe: boolean;
    onSubscribe: (skillId: string) => void;
    onViewEnrolled: () => void;
    onDelete?: () => Promise<void> | void;
    skillQuotas: skillQuota[];
    skillsUser: string[];
    qrBase?: string;
};

export function EventCard({
                              id, title, description, date, location, capacity, leader, state, streetAddress,
                              isLeader, isInscrit, showSuscribe, onSubscribe, onViewEnrolled, onDelete,
                              skillsUser, skillQuotas = [], qrBase,
                          }: Props) {

    const flags = getFlags(state);
    const hasQuotas = Array.isArray(skillQuotas) && skillQuotas.length > 0;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [skillDialogOpen, setSkillDialogOpen] = useState(false);
    const [skillOptions, setSkillOptions] = useState<{ id: string; name: string }[]>([]);
    const { qrOpen, setQrOpen, qrAction, qrValue, openStart, openEnd, accept } =
        useEventQr(id, qrBase, onDelete);
    const matchingSkills = useMemo(() => {
        if (!hasQuotas) return [];
        const userSet = new Set(skillsUser.map(String));
        return skillQuotas
            .filter((sq) => userSet.has(String(sq.id)))
            .map((sq) => ({ id: String(sq.id), name: sq.name }));
    }, [hasQuotas, skillQuotas, skillsUser]);
    async function handleDelete() {
        try {
            const op = deleteEventService(id).then((res) => {
                if (!res.success) return Promise.reject(res);
                return res;
            });

            await toast.promise(op, {
                loading: "Eliminando evento...",
                success: (res: { message?: string }) => <b>{res.message ?? "Eliminado correctamente"}</b>,
                error:   (res: { message?: string }) => <b>{res.message ?? "No se pudo eliminar"}</b>,
            });

            await op;
            setConfirmOpen(false);
            await onDelete?.();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCancel() {
        try {
            const op = cancelInscribeEvent(id).then((res) => {
                if (!res.success) return Promise.reject(res);
                return res;
            });

           await toast.promise(op, {
                loading: "Cancelando inscripción...",
                success: (res: { message?: string }) => <b>{res.message ?? "Cancelado correctamente"}</b>,
                error:   (res: { message?: string }) => <b>{res.message ?? "No se pudo cancelar"}</b>,
            });

            await op;
            await onDelete?.();
        } catch (err) {
            console.error(err);
        }
    }

    function handleSubscribeSlot() {
        if (!hasQuotas) {
            onSubscribe("");
            return;
        }
        if (matchingSkills.length === 0) {
            toast.error("No cumples con las habilidades requeridas para este evento.");
            return;
        }
        if (matchingSkills.length === 1) {
            onSubscribe(matchingSkills[0].id);
            return;
        }
        setSkillOptions(matchingSkills);
        setSkillDialogOpen(true);
    }

    function handleConfirmSkill(skillId: string) {
        setSkillDialogOpen(false);
        onSubscribe(skillId);
    }

    return (
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col border border-gray-100">
            {/* eliminar */}
            <button
                onClick={() => setConfirmOpen(true)}
                className="absolute top-3 right-3 rounded-full p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                title="Eliminar evento"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Cabecera */}
            <div className="p-4 pb-0">
                <div className="flex items-start justify-between gap-3 pr-8">
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">{title}</h3>
                    <EventStatusBadge state={state} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
            </div>

            {/* Info */}
            <EventInfo
                leaderName={leader.name}
                date={date}
                location={location}
                streetAddress={streetAddress}
                capacity={capacity}
                skillQuotas={skillQuotas}
            />

            {/* Acciones */}
            <EventActions
                isLeader={isLeader}
                isInscrit={isInscrit}
                flags={{ isOngoing: flags.isOngoing }}
                showSuscribe={showSuscribe}
                onSubscribe={handleSubscribeSlot}
                onCancel={handleCancel}
                onViewEnrolled={onViewEnrolled}
                openStartQr={openStart}
                openEndQr={openEnd}
            />

            {/* Diálogos */}
            <ConfirmDialog open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleDelete} />

            <SkillSelectDialog
                open={skillDialogOpen}
                options={skillOptions}
                onCancel={() => setSkillDialogOpen(false)}
                onConfirm={handleConfirmSkill}
            />

            <QrDialog
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                title={flags.isOngoing ? "QR de registro (inicio)" : qrAction === "start" ? "QR de registro (inicio)" : "QR de finalización"}
                value={qrValue}
                variant={qrAction}
                onlyClose={qrAction === "start" && flags.isOngoing}
                onAccept={accept}
            />
        </div>
    );
}
