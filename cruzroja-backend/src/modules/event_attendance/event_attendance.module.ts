import { Module } from '@nestjs/common';
import { EventAttendanceController } from './event_attendance.controller';
import { EventAttendanceService } from './event_attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAttendance } from './entity/event_attendance.entity';
import { EventEnrollmentModule } from '../event-enrollment/event-enrollment.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventAttendance]), EventEnrollmentModule],
  controllers: [EventAttendanceController],
  providers: [EventAttendanceService],
  exports: [EventAttendanceService],
})
export class EventAttendanceModule {}
