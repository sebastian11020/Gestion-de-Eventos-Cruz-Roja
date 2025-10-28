import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { SkillQuota } from './create-event.dto';

export class EditEventDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ0-9\s\-.-]+$/, {
    message: 'Titulo invalido',
  })
  title: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[,A-Za-zÁÉÍÓÚÜáéíóúüñÑ0,-9\s\-.-]+$/, {
    message: 'Descripcion invalida',
  })
  description: string;
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
  @IsNumber()
  @Min(1)
  location: number;
  @IsNumber()
  @Min(1)
  capacity: number;
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ0-9\s#\-.-]+$/, {
    message: 'Dirección inválida',
  })
  streetAddress: string;
  @IsString()
  @IsNotEmpty()
  attendant: string;
  @IsArray()
  skill_quota: SkillQuota[];
}
