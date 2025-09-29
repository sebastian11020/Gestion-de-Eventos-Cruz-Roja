export class GetHeadquartersGroupsProgramsDto {
  id: number;
  city: string;
  groups: [id: number, name: string, programs: [id: number, name: string]];
}
