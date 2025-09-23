import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateProgramDto {
  @IsNumber()
  @Min(1)
  id_program: number;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
}
