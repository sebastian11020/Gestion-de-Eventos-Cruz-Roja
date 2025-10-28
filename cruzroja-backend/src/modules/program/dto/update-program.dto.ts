import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProgramDto {
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
}
