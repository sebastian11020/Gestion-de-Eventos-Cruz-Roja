import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateScopeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
}
