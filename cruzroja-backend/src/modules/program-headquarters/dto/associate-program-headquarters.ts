import { IsNumber, Min } from 'class-validator';

export class AssociateProgramHeadquarters {
  @IsNumber()
  @Min(1)
  idHeadquarters: number;
  @IsNumber()
  @Min(1)
  idGroup: number;
  @IsNumber()
  @Min(1)
  idProgram: number;
  document_coordinator: string;
}
