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
  MapPin,
  User2,
  Eye,
  ArrowLeftRight,
  BadgePlus,
  User,
} from "lucide-react";
import Modal from "@/components/layout/modal";
import GroupTable from "@/components/layout/groupTable";
import ViewUser from "@/components/layout/viewUser";
import ChangeLeaderTable from "@/components/layout/changeLeaderTable";

type SectionalCardProps = {
  sectional: sectional;
};

const groups: group[] = [
  {
    id: "1",
    name: "Juvenil",
    leader: {
      document: "1007749746",
      name: "Samuel David Vargas Millan",
    },
    program: [
      { id: "1", name: "Al aire libre", leader: "Juan David Lopez Garcia" },
      { id: "2", name: "Recreacion", leader: "Andres David Lopez Garcia" },
    ],
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

function getInitialsFromFullName(full?: string) {
  const [n = "", l = ""] = (full ?? "").split(" ");
  return `${n.charAt(0)}${l.charAt(0)}`.toUpperCase();
}

export function SectionalCard({ sectional }: SectionalCardProps) {
  const [openGroups, setOpenGroups] = useState(false);
  const [openChangeLeader, setOpenChangeLeader] = useState(false);
  const [viewUser, setViewUser] = useState<FormState | null>(null);
  const handleCloseView = () => setViewUser(null);
  const [openView, setOpenView] = useState(false);
  const initials = getInitialsFromFullName(sectional.leader?.name);

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
      </div>

      {/* Info principal */}
      <div className="space-y-2 text-sm text-gray-600 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              <span className="font-medium text-gray-700">
                N° Agrupaciones:
              </span>{" "}
              {sectional.numberGroups}
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
        <ChangeLeaderTable users={users} />
      </Modal>
      <ViewUser infUser={viewUser} onClose={handleCloseView}></ViewUser>
    </div>
  );
}
