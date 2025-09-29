export class GetProgramHeadquartersDto {
  id: string;
  name: string;
  sectional: string;
  group: string;
  numberVolunteers: string;
  leader?: {
    document?: string;
    name?: string;
  };
}
