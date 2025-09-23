import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { HeadquartersTypeEnum } from '../enum/headquarters-type.enum';

export class CreateHeadquartersDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;

  @IsEnum(HeadquartersTypeEnum)
  type: HeadquartersTypeEnum;

  @IsNumber()
  @Min(1)
  locationId: number;
}
