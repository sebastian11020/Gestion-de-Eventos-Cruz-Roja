import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePersonStatusDto {
  @IsString()
  @IsNotEmpty()
  id_person: string;
  @IsNumber()
  @Min(1)
  id_state: number;
}
