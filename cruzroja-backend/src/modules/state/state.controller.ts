import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { GetStateDto } from './dto/get-state.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('state')
@UseGuards(SupabaseAuthGuard)
export class StateController {
  constructor(private stateService: StateService) {}

  @Post('/create')
  async create(@Body() data: CreateStateDto) {
    return this.stateService.create(data);
  }

  @Get('/all')
  async getAll(): Promise<GetStateDto[]> {
    return this.stateService.getAll();
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateStateDto,
  ) {
    return this.stateService.update(id, dto);
  }
}
