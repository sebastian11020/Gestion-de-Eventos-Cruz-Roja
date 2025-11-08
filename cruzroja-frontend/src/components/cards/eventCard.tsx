"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import { SkillSelectDialog } from "@/components/events/sections/skillSelectDialog";
import { QrDialog } from "@/components/layout/qrDialog";
import {
  deleteEventService,
  cancelInscribeEvent,
} from "@/services/serviceGetEvent";
import type { skillQuota } from "@/types/usertType";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { EventInfo } from "@/components/events/EventInfo";
import { EventActions } from "@/components/events/EventActions";
import { getFlags } from "@/utils/eventStatus";
import { useEventQr } from "@/hooks/useEventQr";
import { useSectionalsNode } from "@/hooks/useSectionalsNode";
import { EditEventDialog } from "@/components/events/EditEventsDialog";
import { Button } from "@/components/ui/button";
import { useEventData } from "@/hooks/useEventData";
import { cities } from "@/components/volunteer/constants";

type Props = {
  id: string;
  title: string;
  description: string;
  date: string;
  city: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  capacity: string;
  state: string;
  isEdit: boolean;
  startDate: string;
  inHistory?: boolean;
  endDate: string;
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
  inHistory = false,
  date,
  capacity,
  leader,
  state,
  streetAddress,
  city,
  department,
  isLeader,
  isInscrit,
  isEdit,
  showSuscribe,
  onSubscribe,
  startDate,
  endDate,
  onViewEnrolled,
  onDelete,
  skillsUser,
  skillQuotas = [],
  qrBase,
}: Props) {
  const flags = getFlags(state);
  const hasQuotas = Array.isArray(skillQuotas) && skillQuotas.length > 0;

  const [editOpen, setEditOpen] = useState(false);
  const canEdit =
    !inHistory && (!flags.isOngoing || (flags.isOngoing && isEdit));
  const { users } = useEventData();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [skillOptions, setSkillOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const { skills } = useSectionalsNode();

  const { qrOpen, setQrOpen, qrAction, qrValue, openStart, openEnd, accept } =
    useEventQr(id, qrBase, onDelete);

  const matchingSkills = useMemo(() => {
    if (!hasQuotas) return [];
    const userSet = new Set(skillsUser.map(String));
    return skillQuotas
      .filter((sq) => userSet.has(String(sq.id)))
      .map((sq) => ({ id: String(sq.id), name: sq.name }));
  }, [hasQuotas, skillQuotas, skillsUser]);

  const skillsOptions = useMemo(
    () => (skills ?? []).map((s) => ({ id: String(s.id), name: s.name ?? "" })),
    [skills],
  );

  async function handleDelete() {
    try {
      const op = deleteEventService(id).then((res) => {
        if (!res.success) return Promise.reject(res);
        return res;
      });

      await toast.promise(op, {
        loading: "Eliminando evento...",
        success: (res: { message?: string }) => (
          <b>{res.message ?? "Eliminado correctamente"}</b>
        ),
        error: (res: { message?: string }) => (
          <b>{res.message ?? "No se pudo eliminar"}</b>
        ),
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
        success: (res: { message?: string }) => (
          <b>{res.message ?? "Cancelado correctamente"}</b>
        ),
        error: (res: { message?: string }) => (
          <b>{res.message ?? "No se pudo cancelar"}</b>
        ),
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
      toast.error(
        "No cumples con las habilidades requeridas para este evento.",
      );
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
      {/* editar + eliminar */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800 leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Badge + acciones alineadas, sin superposición */}
          <div className="flex items-center gap-2 shrink-0">
            <EventStatusBadge state={state} />

            {canEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(true)}
                className={`rounded-full p-1.5 h-8 w-8 ${
                  canEdit
                    ? "border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title={
                  canEdit
                    ? "Editar evento"
                    : "Solo el líder puede editar cuando está en curso"
                }
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            {canEdit && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="rounded-full p-1.5 h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                title="Eliminar evento"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
      </div>
      {/* Info */}
      <EventInfo
        leaderName={leader.name}
        date={date}
        city={city.name}
        department={department.name}
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
        title={
          flags.isOngoing
            ? "QR de registro (inicio)"
            : qrAction === "start"
              ? "QR de registro (inicio)"
              : "QR de finalización"
        }
        value={qrValue}
        variant={qrAction}
        onlyClose={qrAction === "start" && flags.isOngoing}
        onAccept={accept}
      />
      <EditEventDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        eventId={id}
        users={users}
        initial={{
          title,
          description,
          startDate: startDate,
          endDate: endDate,
          city: city.id,
          department: department.id,
          capacity,
          streetAddress,
          attendant: leader?.id ?? "",
          skill_quota:
            skillQuotas?.map((q) => ({
              id: String(q.id),
              name: q.name,
              quantity: Number(q.quantity),
            })) ?? [],
        }}
        skills={skillsOptions}
        onUpdated={onDelete}
        disabled={!canEdit}
      />
    </div>
  );
}
