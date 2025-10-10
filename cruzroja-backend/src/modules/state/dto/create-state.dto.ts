import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { type_state } from '../enum/state-type.enum';

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
  @IsEnum(type_state)
  type: type_state;
}
