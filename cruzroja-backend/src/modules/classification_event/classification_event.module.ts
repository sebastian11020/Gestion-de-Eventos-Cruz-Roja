import { Module } from '@nestjs/common';
import { ClassificationEventController } from './classification_event.controller';
import { ClassificationEventService } from './classification_event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationEvent } from './entity/classification-event';

@Module({
  imports: [TypeOrmModule.forFeature([ClassificationEvent])],
  controllers: [ClassificationEventController],
  providers: [ClassificationEventService],
  exports: [ClassificationEventService],
})
export class ClassificationEventModule {}
