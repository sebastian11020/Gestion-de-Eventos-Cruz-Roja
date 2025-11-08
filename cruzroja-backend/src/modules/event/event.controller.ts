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
import { EditEventDto } from './dto/edit-event.dto';
import { UserId } from '../../common/decorators/user.decorator';

@Controller('event')
@UseGuards(SupabaseAuthGuard)
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

  @Put('/start/:id')
  async start(
    @Param('id', ParseIntPipe) id_event: number,
    @UserId() userId: string,
  ) {
    return this.eventService.startEvent(id_event, userId);
  }

  @Put('/end/:id')
  async end(@Param('id', ParseIntPipe) id_event: number) {
    return this.eventService.endEvent(id_event);
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditEventDto,
  ) {
    return this.eventService.edit(id, dto);
  }

  @Get('/calendar')
  async getCalendar() {
    return this.eventService.getEventCalendar();
  }
}
