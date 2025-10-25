import { Body, Controller, Post } from '@nestjs/common';
import { EventEnrollmentService } from './event-enrollment.service';
import { CreateEventEnrollmentDto } from './dto/create-event-enrollment.dto';
import { CanceledEventEnrollmentDto } from './dto/canceled-event-enrollment.dto';

@Controller('event-enrollment')
export class EventEnrollmentController {
  constructor(
    private readonly eventEnrollmentService: EventEnrollmentService,
  ) {}

  @Post('/enrollment')
  async createEventEnrollment(@Body() dto: CreateEventEnrollmentDto) {
    return this.eventEnrollmentService.enrollment(dto);
  }

  @Post('/canceled-enrollment')
  async canceled(@Body() dto: CanceledEventEnrollmentDto) {
    return this.eventEnrollmentService.canceledEnrollment(dto);
  }
}
