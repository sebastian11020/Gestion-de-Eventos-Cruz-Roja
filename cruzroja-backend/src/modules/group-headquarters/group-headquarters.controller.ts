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

  /*
  @Put('/deactivate/:idGroup/:idHeadquarters')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('idGroup', ParseIntPipe) idGroup: number,
    @Param('idHeadquarters', ParseIntPipe) idHeadquarters: number,
  ) {
    return this.groupHeadquartersService.deactivate(idGroup, idHeadquarters);
  }
   */
}
