"use client";

import {
    CalendarDays,
    MapPin,
    Users,
    Trash2,
    UserCircle2,
    QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    cancelInscribeEvent,
    deleteEventService,
    startEventService,
    endEventService,
} from "@/services/serviceGetEvent";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import { SkillSelectDialog } from "@/components/events/sections/skillSelectDialog";
import type { skillQuota } from "@/types/usertType";
import { QrDialog } from "@/components/layout/qrDialog";

type EventCardProps = {
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
                              id,
                              title,
                              description,
                              date,
                              location,
                              capacity,
                              leader,
                              state,
                              streetAddress,
                              isLeader,
                              isInscrit,
                              showSuscribe,
                              onSubscribe,
                              onViewEnrolled,
                              onDelete,
                              skillsUser,
                              skillQuotas = [],
                              qrBase,
                          }: EventCardProps) {
    const normalize = (s?: string) => (s ?? "").trim().toUpperCase();
    const status = normalize(state);
    const isOngoing = ["EN CURSO", "EN_CURSO", "ONGOING", "IN_PROGRESS"].includes(status);
    const isFinished = ["FINALIZADO", "FINALIZED"].includes(status);
    const isCanceled = ["CANCELADO", "CANCELED", "CANCELLED"].includes(status);

    const statusStyle = (() => {
        if (isOngoing) return "bg-amber-100 text-amber-800 ring-amber-300";
        if (isFinished) return "bg-emerald-100 text-emerald-800 ring-emerald-300";
        if (isCanceled) return "bg-red-100 text-red-800 ring-red-300";
        return "bg-blue-100 text-blue-800 ring-blue-300";
    })();

    const parseQty = (q: number | string) => {
        const n = typeof q === "string" ? parseInt(q, 10) : q;
        return Number.isFinite(n) ? n : 0;
    };

    const hasQuotas = Array.isArray(skillQuotas) && skillQuotas.length > 0;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState<string>("");
    const [skillDialogOpen, setSkillDialogOpen] = useState(false);
    const [skillOptions, setSkillOptions] = useState<{ id: string; name: string }[]>([]);

    // QR state
    const [qrOpen, setQrOpen] = useState(false);
    const [qrAction, setQrAction] = useState<"start" | "end">("start");
    const [qrValue, setQrValue] = useState("");

    const matchingSkills = useMemo(() => {
        if (!hasQuotas) return [];
        const userSet = new Set(skillsUser.map(String));
        return skillQuotas
            .filter((sq) => userSet.has(String(sq.id)))
            .map((sq) => ({ id: String(sq.id), name: sq.name }));
    }, [hasQuotas, skillQuotas, skillsUser]);

    async function handleDelete() {
        try {
            const op = deleteEventService(deleteEventId).then((res) => {
                if (!res.success) return Promise.reject(res);
                return res;
            });

            toast.promise(op, {
                loading: "Eliminando evento...",
                success: (res: { message?: string }) => <b>{res.message ?? "Eliminado correctamente"}</b>,
                error:   (res: { message?: string }) => <b>{res.message ?? "No se pudo eliminar"}</b>,
            });

            await op;
            setConfirmOpen(false);
            await onDelete?.();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCancel() {
        try {
            const op = cancelInscribeEvent(id).then((res) => {
                if (!res.success) return Promise.reject(res);
                return res;
            });

            toast.promise(op, {
                loading: "Cancelando inscripción...",
                success: (res: { message?: string }) => <b>{res.message ?? "Cancelado correctamente"}</b>,
                error:   (res: { message?: string }) => <b>{res.message ?? "No se pudo cancelar"}</b>,
            });

            await op;
            await onDelete?.();
        } catch (error) {
            console.error(error);
        }
    }

    function handleSubscribeClick() {
        if (isOngoing) {
            toast.error("Este evento está en curso. No es posible inscribirse.");
            return;
        }
        if (!hasQuotas) {
            onSubscribe("");
            return;
        }
        const ms = matchingSkills;
        if (ms.length === 0) {
            toast.error("No cumples con las habilidades requeridas para este evento.");
            return;
        }
        if (ms.length === 1) {
            onSubscribe(ms[0].id);
            return;
        }
        setSkillOptions(ms);
        setSkillDialogOpen(true);
    }

    function handleConfirmSkill(skillId: string) {
        setSkillDialogOpen(false);
        onSubscribe(skillId);
    }

    function openStartQr() {
        setQrAction("start");
        setQrValue(qrBase ? `${qrBase.replace(/\/$/, "")}?e=${id}&a=start` : `cr-attend://?e=${id}&a=start`);
        setQrOpen(true);
    }

    function openEndQr() {
        setQrAction("end");
        setQrValue(qrBase ? `${qrBase.replace(/\/$/, "")}?e=${id}&a=end` : `cr-attend://?e=${id}&a=end`);
        setQrOpen(true);
    }

    async function handleAccept() {
        const op =
            qrAction === "start"
                ? startEventService(id)
                : endEventService(id);

        const labels =
            qrAction === "start"
                ? { loading: "Iniciando evento...", success: "Iniciado correctamente", error: "No se pudo iniciar" }
                : { loading: "Finalizando evento...", success: "Finalizado correctamente", error: "No se pudo finalizar" };

        const promise = op.then((res: { success: boolean; message?: string }) => {
            if (!res.success) return Promise.reject(res);
            return res;
        });

        toast.promise(promise, {
            loading: labels.loading,
            success: (res: { message?: string }) => <b>{res.message ?? labels.success}</b>,
            error:   (res: { message?: string }) => <b>{res.message ?? labels.error}</b>,
        });

        await promise;
        setQrOpen(false);
        await onDelete?.();
    }

    return (
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col border border-gray-100">
            {/* Botón eliminar */}
            <button
                onClick={() => {
                    setConfirmOpen(true);
                    setDeleteEventId(id);
                }}
                className="absolute top-3 right-3 rounded-full p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                title="Eliminar evento"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Cabecera */}
            <div className="p-4 pb-0">
                <div className="flex items-start justify-between gap-3 pr-8">
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">{title}</h3>
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle}`}
                        title={`Estado: ${state}`}
                    >
            {state}
          </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
            </div>

            {/* Contenido */}
            <div className="flex flex-col p-4 gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{leader.name}</span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        <span>{date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>
              {location} – <span className="text-gray-700">{streetAddress}</span>
            </span>
                    </div>

                    {capacity && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                Cupo total: <span className="font-medium">{capacity}</span>
              </span>
                        </div>
                    )}

                    {Array.isArray(skillQuotas) && skillQuotas.length > 0 ? (
                        <div className="mt-1">
                            <span className="block text-xs text-gray-500 mb-1">Cupos por habilidad:</span>
                            <div className="flex flex-wrap gap-2">
                                {skillQuotas.map((sq) => (
                                    <span
                                        key={String(sq.id)}
                                        className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700"
                                        title={`${sq.name}: ${parseQty(sq.quantity)} cupos`}
                                    >
                    {sq.name} <span className="font-semibold">{parseQty(sq.quantity)}</span>
                  </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <span className="block text-xs text-gray-500 mb-1">
              No se requieren habilidades especiales
            </span>
                    )}
                </div>
            </div>

            {/* Acciones */}
            <div className="p-4 pt-0 flex flex-col gap-2">
                {showSuscribe && (
                    <>
                        {isLeader ? (
                            isOngoing ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {/* Ver QR de registro (inicio) */}
                                    <Button
                                        onClick={openStartQr}
                                        className="w-full rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                        title="Mostrar QR de registro (inicio)"
                                    >
                                        <QrCode className="w-4 h-4" />
                                        Ver QR de registro
                                    </Button>

                                    {/* Finalizar evento (QR) */}
                                    <Button
                                        onClick={openEndQr}
                                        className="w-full rounded-xl font-medium text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
                                        title="Finalizar evento"
                                    >
                                        <QrCode className="w-4 h-4" />
                                        Finalizar evento (QR)
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={openStartQr}
                                    className="w-full rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                                    title="Iniciar evento"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Iniciar evento (QR)
                                </Button>
                            )
                        ) : isInscrit ? (
                            isOngoing ? (
                                <Button
                                    className="w-full rounded-xl font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                                    title="No puedes cancelar mientras el evento está en curso"
                                    disabled
                                >
                                    No disponible durante el evento
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCancel}
                                    className="w-full rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white"
                                    title="Cancelar inscripción"
                                >
                                    Cancelar inscripción
                                </Button>
                            )
                        ) : (
                            <Button
                                onClick={handleSubscribeClick}
                                className={`w-full rounded-xl font-medium text-white ${isOngoing ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                title={isOngoing ? "Evento en curso" : "Inscribirme"}
                                disabled={isOngoing}
                            >
                                {isOngoing ? "En curso" : "Inscribirme"}
                            </Button>
                        )}
                    </>
                )}

                <Button
                    onClick={onViewEnrolled}
                    variant="outline"
                    className="w-full rounded-xl border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
                >
                    Ver inscritos
                </Button>
            </div>

            {/* Diálogos */}
            <ConfirmDialog
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />

            <SkillSelectDialog
                open={skillDialogOpen}
                options={skillOptions}
                onCancel={() => setSkillDialogOpen(false)}
                onConfirm={handleConfirmSkill}
            />

            <QrDialog
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                title={qrAction === "start" ? "QR de registro (inicio)" : "QR de finalización"}
                value={qrValue}
                variant={qrAction}
                onlyClose={qrAction === "start" && isOngoing} // en curso: el QR de registro solo se oculta
                onAccept={handleAccept}
            />
        </div>
    );
}
