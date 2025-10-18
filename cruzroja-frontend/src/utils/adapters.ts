import type { formCreatePerson, FormState, skill } from "@/types/usertType";
type Legacy = FormState;

function toIdArray(skills?: skill[]): string[] {
    if (!Array.isArray(skills)) return [];
    const ids = skills
        .map(s => s?.id)
        .filter((v): v is string => typeof v === "string" && v.length > 0);
    return Array.from(new Set(ids));
}

export function toFormCreatePerson(u: Legacy): formCreatePerson {
    const id_headquarters = u.sectional?.id ? String(u.sectional.id) : "";
    const id_location     = u.city?.id      ? String(u.city.id)      : "";
    const id_state        = u.state?.id     ? String(u.state.id)     : "";

    const id_group        = u.group?.id                   ? String(u.group.id)       : "";
    const id_program      = u.group?.program?.id          ? String(u.group.program.id) : "";
    const id_eps          = u.eps?.id                     ? String(u.eps.id)         : "";
    const type_affiliation= u.eps?.type ?? "";

    const skillIds        = toIdArray(u.skills);

    return {
        id: u.id ?? "",
        type_document: u.typeDocument ?? "",
        document: u.document ?? "",
        carnet: u.carnet ?? "",
        name: u.name ?? "",
        lastName: u.lastName ?? "",
        email: u.email ?? "",
        sex: u.sex ?? "",
        gender: u.gender ?? "",
        phone: u.cellphone ?? "",
        skills: skillIds,
        emergencyContact: {
            name: u.emergencyContact?.name ?? "",
            relationShip: u.emergencyContact?.relationShip ?? "",
            phone: u.emergencyContact?.phone ?? "",
        },
        blood: u.bloodType ?? "",
        id_state,
        birthDate: u.bornDate ?? "",
        address: {
            streetAddress: u.address ?? "",
            zone: u.zone ?? "",
        },
        id_group,
        id_program,
        id_headquarters,
        id_location,
        id_eps,
        type_affiliation,
    };
}
