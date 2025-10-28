import { Module } from '@nestjs/common';
import { EventStatusService } from './event-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStatus } from './entity/event-status.entity';
import { EventStatusController } from './event-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventStatus])],
  providers: [EventStatusService],
  controllers: [EventStatusController],
  exports: [EventStatusService],
})
export class EventStatusModule {}
