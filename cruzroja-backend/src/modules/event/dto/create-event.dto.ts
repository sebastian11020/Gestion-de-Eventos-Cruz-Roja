import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Attendant {
  @IsString()
  @IsNotEmpty()
  document: string;
}

export class CreateEventForm {
  @IsNumber()
  @Min(1)
  ambit: number;
  @IsNumber()
  @Min(1)
  classification: number;
  @IsBoolean()
  applyDecreet: boolean;
  @IsNumber()
  @Min(1)
  marcActivity: number;
  @IsDate()
  startDate: Date;
  @IsDate()
  endDate: Date;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  streetAddress: string;
  @IsNumber()
  @Min(1)
  city: number;
  @IsNumber()
  @Min(1)
  sectionalId: number;
  @IsNumber()
  @Min(1)
  groupId: number;
  @IsDefined({ message: 'Es necesario un encargado para el evento' })
  @ValidateNested()
  @Type(() => Attendant)
  attendant: Attendant;
  @IsNumber()
  @Min(1)
  capacity: number;
  @IsBoolean()
  isVirtual: boolean;
  @IsBoolean()
  isPrivate: boolean;
  @IsBoolean()
  isAdult: boolean;
  participants?: string[];
  skillsQuotasList?: SkillQuota[];
}

export class SkillQuota {
  @IsNumber()
  @Min(1)
  id: number;
  @IsNumber()
  @Min(0)
  qty: number;
}
