import { IsEnum, IsNumber, Min } from 'class-validator';
import { HeadquartersTypeEnum } from '../enum/headquarters-type.enum';

export class CreateHeadquartersDto {
  @IsEnum(HeadquartersTypeEnum)
  type: HeadquartersTypeEnum;

  @IsNumber()
  @Min(1)
  idLocation: number;
}
