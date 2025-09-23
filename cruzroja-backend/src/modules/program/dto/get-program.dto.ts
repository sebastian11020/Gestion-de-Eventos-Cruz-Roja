export class GetProgramDto {
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
