import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

import { EmergencyContact } from './emergency.dto';
import { Address } from './address.dto';
import { Type } from 'class-transformer';
import { type_affiliation } from 'src/modules/eps-person/enum/eps-person.enum';

export class UpdateProfilePersonDto {
  @IsNotEmpty()
  @IsNumber()
  phone: number;
  @IsDefined({ message: 'El contancto de emergencia es obligatorio' })
  @ValidateNested()
  @Type(() => EmergencyContact)
  emergencyContact: EmergencyContact;
  @IsDefined({ message: 'address es requerido' })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
  @IsNumber()
  @Min(1)
  id_location: number;
  @IsNumber()
  @Min(1)
  id_eps: number;
  @IsEnum(type_affiliation)
  type_affiliation: type_affiliation;
}
