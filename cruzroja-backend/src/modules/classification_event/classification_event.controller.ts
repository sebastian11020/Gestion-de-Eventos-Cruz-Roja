import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClassificationEventService } from './classification_event.service';
import { CreateClassificationEventDto } from './dto/create-classification-event.dto';

@Controller('classification-event')
export class ClassificationEventController {
  constructor(private classificationEventService: ClassificationEventService) {}

  @Post('/create')
  async create(@Body() dto: CreateClassificationEventDto) {
    return this.classificationEventService.create(dto);
  }

  @Get('/all')
  async getAll() {
    return this.classificationEventService.getAll();
  }
}
