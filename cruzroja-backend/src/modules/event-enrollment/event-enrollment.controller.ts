import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventEnrollmentService } from './event-enrollment.service';
import { CreateEventEnrollmentDto } from './dto/create-event-enrollment.dto';
import { CanceledEventEnrollmentDto } from './dto/canceled-event-enrollment.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('event-enrollment')
@UseGuards(SupabaseAuthGuard)
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
