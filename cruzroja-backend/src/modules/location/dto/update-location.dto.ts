import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { LocationTypeEnum } from '../enum/location-type.enum';

export class UpdateLocationDto {
  @IsNumber()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;

  @IsEnum(LocationTypeEnum)
  type: LocationTypeEnum;

  @IsOptional()
  @IsNumber()
  @Min(1)
  parentId?: number;
}
