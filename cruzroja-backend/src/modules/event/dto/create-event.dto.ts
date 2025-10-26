import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
  @IsOptional()
  @IsNumber()
  groupId: number;
  @IsString()
  @IsNotEmpty()
  attendant: string;
  @IsNumber()
  @Min(1)
  capacity: number;
  @IsBoolean()
  isVirtual: boolean;
  @IsBoolean()
  isPrivate: boolean;
  @IsBoolean()
  isAdult: boolean;
  @IsOptional()
  @IsArray()
  participants?: string[];
  @IsArray()
  skillsQuotasList: SkillQuota[];
}

export class SkillQuota {
  @IsNumber()
  @Min(1)
  id: number;
  @IsNumber()
  @Min(0)
  qty: number;
}
