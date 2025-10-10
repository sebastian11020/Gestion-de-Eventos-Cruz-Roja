import { IsNumber, Min } from 'class-validator';

export class CreateGroupHeadquarters {
  @IsNumber()
  @Min(1)
  idHeadquarters: number;
  @IsNumber()
  @Min(1)
  idGroup: number;
  document_leader: string;
}
