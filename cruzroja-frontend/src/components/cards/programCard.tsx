"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  Eye,
  ArrowLeftRight,
  User,
  Trash2,
  Pencil,
  Check,
  X,
  Hospital,
} from "lucide-react";
import Modal from "@/components/layout/modal";
import ViewUser from "@/components/cards/viewUser";
import ChangeLeaderTable from "@/components/tables/changeLeaderTable";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import type {
  FormState,
  leaderDataTable,
  program as TProgram,
} from "@/types/usertType";

type SectionalCardProps = {
  program?: TProgram;
};

const users: leaderDataTable[] = [
  {
    typeDocument: "CC",
    document: "1007749746",
    name: "Sebastian Daza Delgadillo",
    state: "Activo",
    group: "Juvenil",
  },
  {
    typeDocument: "CC",
    document: "1006649646",
    name: "Andres Felipe Melo Avellaneda",
    state: "Activo",
    group: "Socorrismo",
  },
];

export function ProgramCard({ program }: SectionalCardProps) {
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openView, setOpenView] = useState(false);

  // --- Edición de nombre ---
  const [localName, setLocalName] = useState(program?.name ?? "");
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
  function handleSaveName(id: string | undefined) {
    const next = nameDraft.trim();
    if (!next) return;
    setLocalName(next);
    setEditing(false);
    console.log(id);
  }

  function onView(g: string | undefined) {
    setOpenView(true);
    setViewUser({
      typeDocument: "CC",
      document: "1001453276",
      carnet: "a125",
      name: "Andres Felipe",
      lastName: "Melo Avellaneda",
      bloodType: "O+",
      sex: "Masculino",
      state: "Activo",
      bornDate: "2002-03-23",
      department: "Boyacá",
      city: "Tunja",
      zone: "El topo",
      address: "Cra 15#3-12",
      email: "juan@gmail.com",
      cellphone: "3124567654",
      emergencyContact: {
        name: "Andres Castro",
        relationShip: "Primo",
        phone: "3126785478",
      },
      sectional: { id: "1234", city: "Tunja" },
      group: {
        id: "1",
        name: "Juventud",
        program: { id: "1", name: "Aire Libre" },
      },
      eps: { name: "Nueva EPS", type: "Subsidiado" },
      totalHours: "500",
      monthHours: "9",
    });
  }

  function handleDelete() {
    setConfirmOpen(false);
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
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        {/* Título + editor inline */}
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
                  if (e.key === "Enter") handleSaveName(program?.id);
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
                  handleSaveName(program?.id);
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
          onClick={() => setConfirmOpen(true)}
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

      {/* Info principal */}
      <div className="space-y-2 text-sm text-gray-600 flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Seccional:</span>{" "}
            {program?.sectional}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Hospital className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Agrupacion:</span>{" "}
            {program?.group}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">N° Voluntarios:</span>{" "}
            {program?.numberVolunteers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="truncate">
            <span className="font-medium text-gray-700">Líder:</span>{" "}
            {program?.leader?.name}
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
        {program?.leader?.document && (
          <button
            onClick={() => onView(program?.leader!.document)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors"
            aria-label="Ver líder"
          >
            <Eye className="w-4 h-4" />
            Ver líder
          </button>
        )}
      </div>

      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={`Voluntarios - ${localName}`}
      >
        <ChangeLeaderTable users={users} />
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
