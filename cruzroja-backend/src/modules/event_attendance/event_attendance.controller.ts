import { Body, Controller, Post } from '@nestjs/common';
import { EventAttendanceService } from './event_attendance.service';
import { UserId } from '../../common/decorators/user.decorator';
import { CheckInOutDto } from './dto/check-in-out.dto';

@Controller('event-attendance')
export class EventAttendanceController {
  constructor(private event_attendanceService: EventAttendanceService) {}

  @Post()
  async checkIn(@UserId() id_user: string, @Body() dto: CheckInOutDto) {
    return this.event_attendanceService.checkInAndCheckOut(id_user, dto);
  }
}
