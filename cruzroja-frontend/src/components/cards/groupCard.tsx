"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  Eye,
  ArrowLeftRight,
  BadgePlus,
  User,
  Clipboard,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import Modal from "@/components/layout/modal";
import ViewUser from "@/components/cards/viewUser";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import ProgramTable from "@/components/tables/programTable";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import type {
  sectional as TSectional,
  group as TGroup,
  FormState,
  leaderDataTable,
  program,
} from "@/types/usertType";
import toast from "react-hot-toast";
import { deleteGroup, updateGroup } from "@/services/serviceCreateGroups";

type SectionalCardProps = {
  sectional?: TSectional;
  group?: TGroup;
  users:leaderDataTable[];
    onDeleted?: () => Promise<void> | void;
};

const programData: program[] = [
  {
    name: "Aire Libre",
    numberVolunteers: "30",
    leader: { name: "Juan Pablo Martinez Gomez" },
  },
];
export function GroupCard({ group,users,onDeleted }: SectionalCardProps) {
  const [openGroups, setOpenGroups] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [deleteSectionalId, setDeleteSectionalId] = useState("");
  const [localName, setLocalName] = useState(group?.name ?? "");
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(localName);

  function startEdit() {
    setNameDraft(localName);
    setEditing(true);
  }
  function cancelEdit() {
    setEditing(false);
    setNameDraft(localName);
  }
  async function handleSaveName(id: string) {
    const next = nameDraft.trim();
    if (!next) return;
    setLocalName(next);
    setEditing(false);
    toast.loading("Editando agrupacion", { duration: 1000 });
    const response = await updateGroup(id, nameDraft);
    if (response.success) {
      toast.success("Actualizada correctamente", { duration: 3000 });
      await onDeleted?.()
    } else {
      toast.error(response.message, { duration: 3000 });
    }
  }

  function onView(g: string | undefined) {
    setOpenView(true);
  }

  async function handleDelete() {
    try {
        toast.loading("Eliminando Agrupacion", { duration: 3000 });
        const response = await deleteGroup(deleteGroupId, deleteSectionalId);
        if (response.success) {
            toast.success("Agrupacion eliminada correctamente", { duration: 2000 });
            setConfirmOpen(false);
            onDeleted?.()
        }else {
            toast.error(response.message, { duration: 2000 });
            setConfirmOpen(false);
        }
    }catch (error) {
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
      aria-label={localName}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {!editing ? (
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base md:text-lg font-semibold text-gray-900 leading-snug">
                {localName}
              </h3>
              <button
                type="button"
                onClick={startEdit}
                className="
                  inline-flex items-center justify-center rounded-full p-1.5
                  text-gray-600 hover:text-gray-800 hover:bg-gray-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30
                "
                title="Editar nombre"
                aria-label="Editar nombre de la agrupación"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName(group?.id ?? "");
                  if (e.key === "Escape") cancelEdit();
                }}
                required={true}
                className="
                  w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm
                  text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                "
                placeholder="Nombre de la agrupación"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  handleSaveName(group?.id ?? "");
                }}
                className="inline-flex items-center justify-center rounded-md bg-green-600 text-white p-1.5 hover:bg-green-700 active:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
                title="Guardar"
                aria-label="Guardar nombre"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center justify-center rounded-md bg-gray-200 text-gray-700 p-1.5 hover:bg-gray-300 active:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/30"
                title="Cancelar"
                aria-label="Cancelar edición"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Eliminar"
          title="Eliminar"
          onClick={() => {
            setConfirmOpen(true);
            setDeleteGroupId(group?.id ?? "");
            setDeleteSectionalId(group?.sectional?.id ?? "");
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
          "
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600 flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Seccional:</span>{" "}
            {group?.sectional?.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              <span className="font-medium text-gray-700">N° Programas:</span>{" "}
              {group?.numberPrograms}
            </span>
          </div>
          <button
            onClick={() => setOpenGroups(true)}
            className="flex items-center justify-center rounded-full bg-green-100 p-1.5 text-green-600 hover:bg-green-200 transition-colors"
            aria-label="Ver programas"
            title="Ver programas"
          >
            <BadgePlus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">N° Voluntarios:</span>{" "}
            {group?.numberVolunteers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Líder:</span>{" "}
            {group?.leader?.name}
          </span>
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="pt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setOpenChangeLeader(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white text-sm font-medium hover:bg-red-700 active:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition-colors"
          aria-label="Cambiar líder"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Cambiar
        </button>
        {group?.leader?.document && (
          <button
            onClick={() => onView(group?.leader!.document)}
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
        title={`Agrupación - ${localName}`}
      >
        <ProgramTable programs={programData} />
      </Modal>
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={`Voluntarios - ${localName}`}
      >
        <ChangeLeaderTable users={users} sectional={group?.id} onCancel={() => setOpenChangeLeader(false)} isChange={true} isGroup={true}/>
      </Modal>
      <ViewUser infUser={viewUser} onClose={() => setViewUser(null)} />

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
