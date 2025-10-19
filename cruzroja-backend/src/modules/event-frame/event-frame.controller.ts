import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventFrameService } from './event-frame.service';
import { CreateEventFrameDto } from './dto/create-event-frame.dto';

@Controller('event-frame')
export class EventFrameController {
  constructor(private readonly eventFrameService: EventFrameService) {}

  @Post('/create')
  async create(@Body() dto: CreateEventFrameDto) {
    return this.eventFrameService.create(dto);
  }

  @Get('/all')
  async getAll() {
    return this.eventFrameService.getAll();
  }
}
