import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CanceledEventEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  id_person: string;
  @IsNumber()
  @Min(1)
  id_event: number;
}
