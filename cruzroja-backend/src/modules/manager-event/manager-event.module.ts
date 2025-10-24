import { Module } from '@nestjs/common';
import { ManagerEventController } from './manager-event.controller';
import { ManagerEventService } from './manager-event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEvent } from './entity/manager-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEvent])],
  controllers: [ManagerEventController],
  providers: [ManagerEventService],
  exports: [ManagerEventService],
})
export class ManagerEventModule {}
