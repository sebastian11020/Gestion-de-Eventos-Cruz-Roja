import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AssociateProgramHeadquarters {
  @IsNumber()
  @Min(1)
  idHeadquarters: number;
  @IsNumber()
  @Min(1)
  id_group: number;
  @IsNumber()
  @Min(1)
  idProgram: number;
  @IsString()
  @IsNotEmpty()
  leader: string;
}
