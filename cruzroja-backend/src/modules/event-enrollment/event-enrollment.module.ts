import { Module } from '@nestjs/common';
import { EventEnrollmentController } from './event-enrollment.controller';
import { EventEnrollmentService } from './event-enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEnrollment } from './entity/event-enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEnrollment])],
  controllers: [EventEnrollmentController],
  providers: [EventEnrollmentService],
  exports: [EventEnrollmentService],
})
export class EventEnrollmentModule {}
