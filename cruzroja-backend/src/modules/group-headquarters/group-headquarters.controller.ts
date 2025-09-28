import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GroupHeadquartersService } from './group-headquarters.service';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';

@Controller('group-headquarters')
export class GroupHeadquartersController {
  constructor(private groupHeadquartersService: GroupHeadquartersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async findAllGroupHeadquarters() {
    return this.groupHeadquartersService.getAllGroupHeadquartersDto();
  }

  @Post('/associate')
  @HttpCode(HttpStatus.CREATED)
  async associate(@Body() dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersService.createOrActivate(dto);
  }

  @Post('/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Body() dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersService.deactivate(dto);
  }
}
