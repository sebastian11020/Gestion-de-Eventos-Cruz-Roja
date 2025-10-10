import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class Address {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ0-9\s#\-.]+$/, {
    message: 'Dirección inválida',
  })
  streetAddress: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ\s-]+$/, {
    message: 'Barrio inválido: solo letras, espacios y guiones',
  })
  zone: string;
}
