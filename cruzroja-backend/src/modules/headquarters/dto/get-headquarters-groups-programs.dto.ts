export class GetHeadquartersGroupsProgramsDto {
  id: number;
  name: string;
  leader: {
    name: string;
  };
  program: [id: number, name: string];
}
