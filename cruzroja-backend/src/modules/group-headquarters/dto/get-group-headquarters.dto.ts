export class GetGroupHeadquartersDto {
  id: string;
  name: string;
  sectional: {
    id: string;
    name: string;
  };
  numberVolunteers: string;
  numberPrograms: string;
  leader?: {
    document: string;
    name: string;
  };
  programs?: {
    id: string;
    name: string;
  };
}
