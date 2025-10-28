import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateEventEnrollmentDto {
  @IsNumber()
  @Min(1)
  id_event: number;
  @IsNumber()
  @Min(1)
  id_skill: number;
  @IsNotEmpty()
  @IsString()
  id_person: string;
}
