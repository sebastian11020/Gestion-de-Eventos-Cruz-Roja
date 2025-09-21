import { LocationTypeEnum } from '../enum/location-type.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateLocationDto {
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
