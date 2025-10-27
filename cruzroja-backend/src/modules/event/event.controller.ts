import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventForm } from './dto/create-event.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('event')
@UseGuards(SupabaseAuthGuard)
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('/create')
  async create(@Body() dto: CreateEventForm) {
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

  @Put('/start/:id')
  async start(@Param('id', ParseIntPipe) id_event: number) {
    return this.eventService.startEvent(id_event);
  }

  @Put('/end/:id')
  async end(@Param('id', ParseIntPipe) id_event: number) {
    return this.eventService.endEvent(id_event);
  }
}
