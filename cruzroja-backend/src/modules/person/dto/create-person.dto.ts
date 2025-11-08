import {
  IsArray,
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

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsEnum(type_document, { message: 'El tipo seleccionado no es valido' })
  type_document: type_document;
  @IsNotEmpty({ message: 'El numero de documento es obligatorio' })
  @IsString()
  @Matches(/^[A-Z0-9-]{4,30}$/, {
    message: 'Documento inválido: use letras, números o guiones (4–30)',
  })
  document: string;
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  name: string;
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @IsString()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s]+$/, {
    message: 'Solo se permiten letras y espacios',
  })
  lastName: string;
  @IsEmail({}, { message: 'Debes ingresar un correo valido' })
  email: string;
  @IsEnum(type_sex, { message: 'El sexo especificado no se puede guadar' })
  sex: type_sex;
  @IsEnum(type_gender, {
    message: 'El genero especificado no se puede guardar',
  })
  gender: type_gender;
  @IsNotEmpty({ message: 'El numero de telefono es obligatorio' })
  @IsNumber()
  phone: number;
  @IsDefined({ message: 'El contancto de emergencia es obligatorio' })
  @ValidateNested()
  @Type(() => EmergencyContact)
  emergencyContact: EmergencyContact;
  @IsEnum(type_blood, { message: 'El tipo especificado no es valido' })
  blood: type_blood;
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Formato de fecha inválido (YYYY-MM-DD)',
  })
  birthDate: string;
  @IsDefined({ message: 'la direccion es obligatoria' })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
  @IsOptional()
  @IsNumber()
  id_group?: number;
  @IsOptional()
  @IsNumber()
  id_program?: number;
  @IsNumber({}, { message: 'El dato ingresado no es numerico' })
  @Min(1)
  id_headquarters: number;
  @IsNumber()
  @Min(1)
  id_location: number;
  @IsNumber({}, { message: 'El dato ingresado no es numerico' })
  @Min(1)
  id_eps: number;
  @IsEnum(type_affiliation, {
    message: 'El tipo de afiliacion seleccionado no es valido',
  })
  type_affiliation: type_affiliation;
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ0-9\s]+$/, {
    message: 'Solo se permiten letras, números y espacios',
  })
  carnet: string;
  @IsNumber({}, { message: 'El dato ingresado no es numerico' })
  @IsOptional()
  @Min(1)
  id_state: number;
  @IsString()
  @IsNotEmpty({ message: 'El dato es obligatorio y de suma importancia' })
  password: string;
  @IsArray()
  @IsNotEmpty({ message: 'Minimo debe tener una habilidad' })
  @Type(() => Number)
  skills: number[];
}
