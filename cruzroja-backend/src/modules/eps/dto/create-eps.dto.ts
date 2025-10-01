import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateEpsDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ.,\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
}
