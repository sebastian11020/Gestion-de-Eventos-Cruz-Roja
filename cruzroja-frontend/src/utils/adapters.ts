import type { formCreatePerson, FormState } from "@/types/usertType";

import { SECTIONALS } from "@/mocks/sectionals";

type Legacy = FormState;

export function toFormCreatePerson(u: Legacy): formCreatePerson {
  const sectional = SECTIONALS.find((s) => s.city === u.sectional.city);
  const id_headquarter = sectional?.id ? String(sectional.id) : "";
  const id_location = u.city ? String(u.city) : "";
  const group = sectional?.groups.find((g) => g.name === u.group.name);
  const id_group = group?.id ? String(group.id) : "";

  const program = group?.programs.find((p) => p.name === u.group.program.name);
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
    id_state: u.state ?? "Formacion",
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
    id_headquarter,
    id_group,
    id_program,
    id_eps: u.eps?.name ?? "",
    type_affiliation: u.eps?.type ?? "",
  };
}
