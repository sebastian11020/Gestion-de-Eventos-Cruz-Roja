import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventForm } from './dto/create-event.dto';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('/create')
  async create(@Body() dto: CreateEventForm) {
      console.log(dto);
    return this.eventService.create(dto);
  }

  @Put('/deactivate/:id')
  async deactivate(@Param('id', ParseIntPipe) id_event: number) {
    return this.eventService.deactivate(id_event);
  }

  @Get('/all')
  async getAll(@Query('id_user') id_user: string) {
    return this.eventService.getAllDto(id_user);
  }
}
