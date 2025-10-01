export class GetHeadquartersGroupsProgramsDto {
  id: number;
  city: string;
  groups: [id: number, name: string, program: [id: number, name: string]];
}
