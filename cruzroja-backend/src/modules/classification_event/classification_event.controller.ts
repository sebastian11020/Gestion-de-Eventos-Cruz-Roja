import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClassificationEventService } from './classification_event.service';
import { CreateClassificationEventDto } from './dto/create-classification-event.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('classification-event')
@UseGuards(SupabaseAuthGuard)
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
