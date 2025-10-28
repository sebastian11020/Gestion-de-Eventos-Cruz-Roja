import type { formCreatePerson } from "@/types/usertType";

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
  skills: [],
  address: { streetAddress: "", zone: "" },
  email: "",
  phone: "",
  emergencyContact: { name: "", relationShip: "", phone: "" },
  id_headquarters: "",
  id_group: "",
  id_program: "",
  id_eps: "",
  type_affiliation: "",
};
