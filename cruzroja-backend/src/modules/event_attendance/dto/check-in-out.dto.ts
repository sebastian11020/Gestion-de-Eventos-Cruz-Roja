import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ActionEnum } from '../enum/action.enum';

export class CheckInOutDto {
  @IsNumber()
  @Min(1)
  id_event: number;
  @IsEnum(ActionEnum)
  action: ActionEnum;
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
