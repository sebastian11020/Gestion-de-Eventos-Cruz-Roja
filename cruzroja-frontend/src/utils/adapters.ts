import type { formCreatePerson, FormState } from "@/types/usertType";
type Legacy = FormState;

export function toFormCreatePerson(u: Legacy): formCreatePerson {
  const sectional = u.sectional;
  const id_headquarters = sectional?.id ? String(sectional.id) : "";
  const id_location = u.city?.id ? String(u.city.id) : "";
  const group = u.group;
  const id_group = group?.id ? String(group.id) : "";
  const id_eps = u.eps.id ? String(u.eps.id) : "";
  const program = group?.program;
  const id_program = program?.id ? String(program.id) : "";

  return {
    id: "",
    type_document: u.typeDocument ?? "",
    document: u.document ?? "",
    carnet: u.carnet ?? "",
    name: u.name ?? "",
    lastName: u.lastName ?? "",
    blood: u.bloodType ?? "",
    sex: u.sex ?? "",
    gender: u.gender ?? "",
    id_state: u.state.name ?? "Formacion",
    birthDate: u.bornDate ?? "",
    id_location,
    address: {
      streetAddress: u.address ?? "",
      zone: u.zone ?? "",
    },
    email: u.email ?? "",
    phone: u.cellphone ?? "",
    emergencyContact: {
      name: u.emergencyContact?.name ?? "",
      relationShip: u.emergencyContact?.relationShip ?? "",
      phone: u.emergencyContact?.phone ?? "",
    },
    id_headquarters,
    id_group,
    id_program,
    id_eps,
    type_affiliation: u.eps?.type ?? "",
  };
}
