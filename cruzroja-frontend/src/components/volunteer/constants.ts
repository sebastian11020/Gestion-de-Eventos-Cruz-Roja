import type { formCreatePerson, sectional, group } from "@/types/usertType";

export type cities = { id: string; name: string };

export const INITIAL_FORM: formCreatePerson = {
    id: "",
    type_document: "",
    document: "",
    carnet: "",
    name: "",
    lastName: "",
    blood: "",
    sex: "",
    gender: "",
    id_state: "Formacion",
    birthDate: "",
    id_location: "",
    address: { streetAddress: "", zone: "" },
    email: "",
    phone: "",
    emergencyContact: { name: "", relationShip: "", phone: "" },
    id_headquarter: "",
    id_group: "",
    id_program: "",
    id_eps: "",
    type_affiliation: "",
};

export const SECTIONAL_TYPES: sectional[] = [
    { id: "1", city: "Tunja" },
    { id: "2", city: "Duitama" },
    { id: "3", city: "Sogamoso" },
];

// Nota: Se conserva el nombre original GRUOP_TYPES para NO romper lógica existente
export const GRUOP_TYPES: group[] = [
    {
        id: "1",
        name: "Juventud",
        program: [
            { id: "1", name: "Programa al aire libre" },
            { id: "2", name: "Infantiles y Pre-juveniles" },
            { id: "3", name: "Servicio social estudiantil" },
            { id: "4", name: "Recreacion" },
        ],
    },
    {
        id: "2",
        name: "Socorrismo",
        program: [
            { id: "5", name: "Busqueda y Rescate" },
            { id: "6", name: "Busqueda y rescate con caninos" },
            { id: "7", name: "Servicios especiales" },
        ],
    },
    {
        id: "3",
        name: "Damas Grises",
        program: [
            { id: "8", name: "PAMES" },
            { id: "9", name: "PEDEC" },
        ],
    },
];