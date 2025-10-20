import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventForm } from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('/create')
  async create(@Body() dto: CreateEventForm) {
    return this.eventService.create(dto);
  }

  @Get('/all')
  async getAll() {
    return this.eventService.getAllDto();
  }
}
