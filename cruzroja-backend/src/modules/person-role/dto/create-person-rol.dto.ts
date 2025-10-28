export class CreatePersonRoleDto {
  id_role: number;
  id_person: string;
  id_headquarters: number;
  id_group_headquarters?: number;
  id_program_headquarters?: number;
}
