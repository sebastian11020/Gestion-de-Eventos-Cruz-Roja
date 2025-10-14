export class GetProgramHeadquartersDto {
  id: string;
  id_program: string;
  name: string;
  sectional: string;
  group: string;
  numberVolunteers: string;
  leader?: {
    document?: string;
    name?: string;
  };
}
