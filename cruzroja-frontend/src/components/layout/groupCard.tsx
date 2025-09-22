"use client";

import { useState } from "react";
import {
  sectional,
  group,
  FormState,
  leaderDataTable,
  program,
} from "@/types/usertType";
import {
    Users,
    MapPin,
    Eye,
    ArrowLeftRight,
    BadgePlus,
    User,
    Clipboard, Trash2,
} from "lucide-react";
import Modal from "@/components/layout/modal";
import ViewUser from "@/components/layout/viewUser";
import ChangeLeaderTable from "@/components/layout/changeLeaderTable";
import ProgramTable from "@/components/layout/programTable";
import {ConfirmDialog} from "@/components/layout/confitmDialog";

type SectionalCardProps = {
  sectional?: sectional;
  group?: group;
};

const programData: program[] = [
  {
    name: "Aire Libre",
    numberVolunteers: "30",
    leader: { name: "Juan Pablo Martinez Gomez" },
  },
];

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

export function GroupCard({ group }: SectionalCardProps) {
  const [openGroups, setOpenGroups] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
  const handleCloseView = () => setViewUser(null);
  const [openView, setOpenView] = useState(false);

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
      sectional: {
        id: "1234",
        city: "Tunja",
      },
      group: {
        id: "1",
        name: "Juventud",
        program: {
          id: "1",
          name: "Aire Libre",
        },
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
      aria-label={group?.name}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug truncate">
          {group?.name}
        </h3>
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
    disabled:opacity-60 disabled:cursor-not-allowed
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
            {group?.sectional}
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
        title={`Agrupación - ${group?.name}`}
      >
        <ProgramTable programs={programData} />
      </Modal>
      <Modal
        open={openChangeLeader}
        onClose={() => setOpenChangeLeader(false)}
        title={`Voluntarios - ${group?.name}`}
      >
        <ChangeLeaderTable users={users} />
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
