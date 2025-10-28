import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;

  @IsNumber()
  @Min(1)
  id_group: number;
}
