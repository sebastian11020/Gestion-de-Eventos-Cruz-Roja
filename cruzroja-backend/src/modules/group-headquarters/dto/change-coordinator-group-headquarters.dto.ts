import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ChangeCoordinatorGroupHeadquartersDto {
  @IsNumber()
  @Min(1)
  idSectional: number;
  @IsNumber()
  @Min(1)
  idGroupHeadquarters: number;
  @IsString()
  @IsNotEmpty({ message: 'El coordinatorio es obligatorio' })
  leader: string;
}
