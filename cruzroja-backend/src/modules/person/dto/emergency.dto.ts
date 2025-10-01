import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class EmergencyContact {
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
  relationShip: string;
  @IsNotEmpty()
  @IsNumber()
  phone: number;
}
