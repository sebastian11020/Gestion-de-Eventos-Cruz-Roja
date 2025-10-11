export class GetHeadquartersDto {
  id: string;
  city: string;
  type: string;
  numberVolunteers?: string;
  numberGroups?: string;
  leader: {
    document: string;
    name: string;
  };
}
