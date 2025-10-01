import { type_affiliation } from '../enum/eps-person.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateEpsPersonDTO {
  @IsString()
  @IsNotEmpty()
  id_person: string;
  @IsNumber()
  @Min(1)
  id_eps: number;
  @IsEnum(type_affiliation)
  affiliation: type_affiliation;
}
