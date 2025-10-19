import { Module } from '@nestjs/common';
import { EventFrameController } from './event-frame.controller';
import { EventFrameService } from './event-frame.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventFrame } from './entity/event-frame';

@Module({
  imports: [TypeOrmModule.forFeature([EventFrame])],
  controllers: [EventFrameController],
  providers: [EventFrameService],
  exports: [EventFrameService],
})
export class EventFrameModule {}
