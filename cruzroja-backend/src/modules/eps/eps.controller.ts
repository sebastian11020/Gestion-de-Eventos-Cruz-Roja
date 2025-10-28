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
import { EpsService } from './eps.service';
import { CreateEpsDto } from './dto/create-eps.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('eps')
@UseGuards(SupabaseAuthGuard)
export class EpsController {
  constructor(private epsService: EpsService) {}

  @Get('/all')
  async getAllEps() {
    return this.epsService.getAllDto();
  }

  @Post('/create')
  async create(@Body() createEpsDto: CreateEpsDto) {
    return this.epsService.create(createEpsDto);
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createEpsDto: CreateEpsDto,
  ) {
    return this.epsService.update(id, createEpsDto);
  }
}
