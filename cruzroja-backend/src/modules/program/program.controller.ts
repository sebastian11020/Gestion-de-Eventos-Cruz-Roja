import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('program')
@UseGuards(SupabaseAuthGuard)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.programService.getAllDto();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateProgramDto) {
    return this.programService.create(data);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProgramDto,
  ) {
    return this.programService.update(id, data);
  }
}
