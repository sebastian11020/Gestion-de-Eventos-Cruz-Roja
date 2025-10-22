import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { GroupHeadquartersModule } from '../group-headquarters/group-headquarters.module';
import { PersonModule } from '../person/person.module';
import { EventStatusModule } from '../event-status/event-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    GroupHeadquartersModule,
    PersonModule,
    EventStatusModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
