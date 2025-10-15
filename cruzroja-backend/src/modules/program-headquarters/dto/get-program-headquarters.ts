export class GetProgramHeadquartersDto {
  id: string;
  id_program: string;
  name: string;
  sectional: {
    id: string;
    name: string;
  };
  group: string;
  numberVolunteers: string;
  leader?: {
    document?: string;
    name?: string;
  };
}
