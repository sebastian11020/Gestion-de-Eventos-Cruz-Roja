import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventFrameService } from './event-frame.service';
import { CreateEventFrameDto } from './dto/create-event-frame.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('event-frame')
@UseGuards(SupabaseAuthGuard)
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
