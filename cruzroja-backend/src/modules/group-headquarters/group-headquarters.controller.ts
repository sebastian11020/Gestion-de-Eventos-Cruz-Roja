import { Body, Controller, Post } from '@nestjs/common';
import { GroupHeadquartersService } from './group-headquarters.service';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';

@Controller('group-headquarters')
export class GroupHeadquartersController {
  constructor(private groupHeadquartersService: GroupHeadquartersService) {}

  @Post('/associate')
  async associate(@Body() dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersService.createOrActivate(dto);
  }

  @Post('/deactivate')
  async deactivate(@Body() dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersService.deactivate(dto);
  }
}
