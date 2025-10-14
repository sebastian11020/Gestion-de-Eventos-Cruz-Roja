import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ChangeCoordinatorGroupHeadquartersDto {
  @IsNumber()
  @Min(1)
  idSectional: number;
  @IsString()
  @IsNotEmpty()
  leader: string;
}
