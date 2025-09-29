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

@Controller('headquarters')
export class HeadquartersController {
  constructor(private headquartersService: HeadquartersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.headquartersService.getAllDto();
  }

  @Get('/allInfo')
  async getAllInfo() {
    return await this.headquartersService.getAllWithGroupsAndPrograms();
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
}
