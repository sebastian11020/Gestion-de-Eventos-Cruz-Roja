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
} from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { ChangeLeaderHeadquartersDto } from './dto/change-leader-headquarters.dto';

@Controller('headquarters')
export class HeadquartersController {
  constructor(private headquartersService: HeadquartersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.headquartersService.getAllDto();
  }

  @Get('/MissingProgram')
  async getMissingPrograms() {
    return await this.headquartersService.getAllWithGroupsAndMissingPrograms();
  }

  @Get('/WithProgram')
  async getWithProgramsActive() {
    return await this.headquartersService.getAllWithGroupsAndPrograms();
  }

  @Get('/table/:programId')
  async getTable(@Param('programId', ParseIntPipe) programId: number) {
    return await this.headquartersService.getInfoTable(programId);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateHeadquartersDto) {
    return await this.headquartersService.create(dto);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number) {
    return await this.headquartersService.deactivate(id);
  }

  @Post('/change-leader')
  @HttpCode(HttpStatus.OK)
  async changeLeader(@Body() dto: ChangeLeaderHeadquartersDto) {
    return await this.headquartersService.changeLeader(dto);
  }
}
