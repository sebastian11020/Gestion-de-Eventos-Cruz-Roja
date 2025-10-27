import { Module } from '@nestjs/common';
import { EventAttendanceController } from './event_attendance.controller';
import { EventAttendanceService } from './event_attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAttendance } from './entity/event_attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventAttendance])],
  controllers: [EventAttendanceController],
  providers: [EventAttendanceService],
  exports: [EventAttendanceService],
})
export class EventAttendanceModule {}
