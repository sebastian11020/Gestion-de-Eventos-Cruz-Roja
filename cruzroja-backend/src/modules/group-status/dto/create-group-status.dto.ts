import { IsNumber, Min } from 'class-validator';

export class CreateGroupStatusDto {
  @IsNumber()
  @Min(1)
  id_state: number;
  @IsNumber()
  @Min(1)
  id_group_headquarters: number;
}
