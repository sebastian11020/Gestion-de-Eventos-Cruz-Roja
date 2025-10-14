export class GetGroupHeadquartersDto {
  id: string;
  id_group: string;
  name: string;
  sectional: {
    id: string;
    name: string;
  };
  numberVolunteers: string;
  numberPrograms: string;
  leader: {
    document: string;
    name: string;
  };
}
