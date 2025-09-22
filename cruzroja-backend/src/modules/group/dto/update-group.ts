import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateGroupDto {
  @IsNumber()
  @Min(1)
  id_group: number;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name?: string;
}
