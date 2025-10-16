import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('/create')
  async create(@Body() createRoleDto: CreateSkillDto) {
    return this.skillService.create(createRoleDto);
  }

  @Get('/all')
  async getAll() {
    return this.skillService.getAllDto();
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSkillDto,
  ) {
    return this.skillService.update(id, dto);
  }
}
