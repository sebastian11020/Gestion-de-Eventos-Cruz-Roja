import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ChangeCoordinatorProgramsDto {
  @IsNumber()
  @Min(1)
  idSectional: number;
  @IsNumber()
  @Min(1)
  idProgramsHeadquarters: number;
  @IsString()
  @IsNotEmpty()
  leader: string;
}
