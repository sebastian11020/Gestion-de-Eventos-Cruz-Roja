import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateGroupHeadquarters {
  @IsNumber()
  @Min(1)
  idHeadquarters: number;
  @IsNumber()
  @Min(1)
  idGroup: number;
  @IsString()
  @IsNotEmpty()
  leader: string;
}
