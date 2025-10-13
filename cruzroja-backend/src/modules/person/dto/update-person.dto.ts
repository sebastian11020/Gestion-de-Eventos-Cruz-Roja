import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  type_blood,
  type_document,
  type_gender,
  type_sex,
} from '../enum/person.enums';
import { EmergencyContact } from './emergency.dto';
import { Address } from './address.dto';
import { Type } from 'class-transformer';
import { type_affiliation } from 'src/modules/eps-person/enum/eps-person.enum';

export class UpdatePersonDto {
  @IsEnum(type_document)
  type_document: type_document;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9-]{4,30}$/, {
    message: 'Documento inválido: use letras, números o guiones (4–30)',
  })
  document: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  lastName: string;
  @IsEmail()
  email: string;
  @IsEnum(type_sex)
  sex: type_sex;
  @IsEnum(type_gender)
  gender: type_gender;
  @IsNotEmpty()
  @IsNumber()
  phone: number;
  @IsDefined({ message: 'El contancto de emergencia es obligatorio' })
  @ValidateNested()
  @Type(() => EmergencyContact)
  emergencyContact: EmergencyContact;
  @IsEnum(type_blood)
  blood: type_blood;
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  birthDate: string;
  @IsDefined({ message: 'address es requerido' })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
  @IsOptional()
  @IsNumber()
  @Min(1)
  id_group?: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  id_program?: number;
  @IsNumber()
  @Min(1)
  id_headquarters: number;
  @IsNumber()
  @Min(1)
  id_location: number;
  @IsNumber()
  @Min(1)
  id_eps: number;
  @IsEnum(type_affiliation)
  type_affiliation: type_affiliation;
  @IsString()
  @IsOptional()
  carnet: string;
  @IsNumber()
  @IsOptional()
  @Min(1)
  id_state: number;
}
