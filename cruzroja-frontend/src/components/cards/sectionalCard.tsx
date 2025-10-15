"use client";

import { useState } from "react";
import {
  sectional,
  group,
  FormState,
  leaderDataTable,
} from "@/types/usertType";
import {
  Users,
  Trash2,
  Eye,
  ArrowLeftRight,
  BadgePlus,
  User,
  Hospital,
} from "lucide-react";
import Modal from "@/components/layout/modal";
import GroupTable from "@/components/tables/groupTable";
import ViewUser from "@/components/cards/viewUser";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import { deleteSectional } from "@/services/serviceCreateSectional";
import toast from "react-hot-toast";
import {getGroupTable} from "@/services/serviceGetGroup";
import {getPersonId} from "@/services/serviceGetPerson";

type SectionalCardProps = {
  sectional: sectional;
  users:leaderDataTable[];
    onDeleted?: () => Promise<void> | void;
};

export function SectionalCard({ sectional,users,onDeleted }: SectionalCardProps) {
  const [openGroups, setOpenGroups] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const handleCloseView = () => setViewUser(null);
  const [openView, setOpenView] = useState(false);
  const [groups, setGroups] = useState<group[]>([]);

  async function onView(id: string) {
    try {
        const response = await getPersonId(id);
        console.log(response.leader);
        if (response.success) {
            setOpenView(true);
            setViewUser(response.leader);
        }else {
            toast.error(response.message);
        }
    }catch (error) {
        console.error(error);
    }
  }

  async function handleDelete() {
    toast.loading("Eliminando sede", { duration: 1000 });
    const response = await deleteSectional(idDelete);
    if (response.success) {
      toast.success("Sede eliminada correctamente", { duration: 3000 });
      await onDeleted?.();
    } else {
      toast.error("No se ha podido eliminar la sede", { duration: 3000 });
    }
    setConfirmOpen(false);
  }

  async function GetGroupTable(id:string) {
      try {
          const response = await getGroupTable(id)
          console.log(response)
          setGroups(response)
      }catch (error){
          console.error(error);
      }
  }

  return (
    <div
      className="
        group rounded-2xl border border-gray-200 bg-white p-4 md:p-5
        shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        focus-within:ring-2 focus-within:ring-red-200
        flex flex-col
      "
      role="article"
      aria-label={`${sectional.type} - ${sectional.city}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug truncate">
          {sectional.city}
        </h3>
        <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
          {sectional.type}
        </span>
        <button
          type="button"
          aria-label="Eliminar"
          title="Eliminar"
          onClick={() => {
            setConfirmOpen(true);
            setIdDelete(sectional.id ?? "");
          }}
          className="
    inline-flex items-center justify-center
    rounded-full p-2
    text-red-600 bg-red-50
    hover:bg-red-100 hover:text-red-700
    active:bg-red-200
    shadow-sm transition
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white
    disabled:opacity-60 disabled:cursor-not-allowed
  "
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hospital className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              <span className="font-medium text-gray-700">
                N° Agrupaciones:
              </span>{" "}
              {sectional.numberGroups}
            </span>
          </div>
          <button
            onClick={() => {setOpenGroups(true),GetGroupTable(sectional.id ?? '')}}
            className="flex items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600 hover:bg-green-200 transition-colors"
            aria-label="Ver agrupaciones"
            title="Ver agrupaciones"
          >
            <BadgePlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">N° Voluntarios:</span>{" "}
            {sectional.numberVolunteers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Líder:</span>{" "}
            {sectional.leader?.name}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Acciones */}
      <div className="pt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setOpenChangeLeader(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white text-sm font-medium hover:bg-red-700 active:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition-colors"
          aria-label="Cambiar líder"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Cambiar
        </button>
        {sectional.leader?.document && (
          <button
            onClick={() => onView(sectional.leader!.document)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors"
            aria-label="Ver líder"
          >
            <Eye className="w-4 h-4" />
            Ver líder
          </button>
        )}
      </div>

      <Modal
        open={openGroups}
        onClose={() => setOpenGroups(false)}
        title={`Agrupaciones - ${sectional.city}`}
      >
        <GroupTable groups={groups} />
      </Modal>
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={`Voluntarios - ${sectional.city}`}
      >
        <ChangeLeaderTable users={users} onCancel={() => setOpenChangeLeader(false)} sectional={sectional.id} isChange={true} isSectional={true} onDeleted={onDeleted} />
      </Modal>
      <ViewUser infUser={viewUser} onClose={handleCloseView}></ViewUser>
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
