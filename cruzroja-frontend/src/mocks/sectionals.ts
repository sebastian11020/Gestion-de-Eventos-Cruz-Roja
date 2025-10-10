import { leaderDataTable } from "@/types/usertType";

type ProgramItem = { id: string; name: string };
type GroupNode = { id: string; name: string; programs: ProgramItem[] };
type SectionalNode = { id: string; city: string; groups: GroupNode[] };

export const SECTIONALS: SectionalNode[] = [
  {
    id: "1234",
    city: "Tunja",
    groups: [
      {
        id: "1",
        name: "Juventud",
        programs: [
          { id: "1", name: "Aire Libre" },
          { id: "2", name: "Infantiles y Pre-juveniles" },
          { id: "3", name: "Servicio social estudiantil" },
          { id: "4", name: "Recreación" },
        ],
      },
      {
        id: "2",
        name: "Socorrismo",
        programs: [
          { id: "5", name: "Búsqueda y Rescate" },
          { id: "6", name: "Búsqueda y rescate con caninos" },
          { id: "7", name: "Servicios especiales" },
        ],
      },
      {
        id: "3",
        name: "Damas Grises",
        programs: [
          { id: "8", name: "PAMES" },
          { id: "9", name: "PEDEC" },
        ],
      },
    ],
  },
  {
    id: "5678",
    city: "Duitama",
    groups: [
      {
        id: "4",
        name: "Juventud",
        programs: [
          { id: "10", name: "Aire Libre" },
          { id: "11", name: "Infantiles y Pre-juveniles" },
        ],
      },
      {
        id: "5",
        name: "Socorrismo",
        programs: [
          { id: "12", name: "Búsqueda y Rescate" },
          { id: "13", name: "Servicios especiales" },
        ],
      },
    ],
  },
  {
    id: "9012",
    city: "Sogamoso",
    groups: [
      {
        id: "6",
        name: "Juventud",
        programs: [{ id: "14", name: "Recreación" }],
      },
      {
        id: "7",
        name: "Damas Grises",
        programs: [{ id: "15", name: "PAMES" }],
      },
    ],
  },
];

export const users: leaderDataTable[] = [
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
