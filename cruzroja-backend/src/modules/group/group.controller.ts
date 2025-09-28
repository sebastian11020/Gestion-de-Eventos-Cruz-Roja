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
import { GroupService } from './group.service';
import { GetGroupDto } from './dto/get-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async findAllGroup(): Promise<GetGroupDto[]> {
    return await this.groupService.getAllGroupDto();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findAllGroupHeadquarters() {
    return this.groupService.getAllGroupHeadquartersDto();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGroupDto) {
    return await this.groupService.create(dto);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupDto,
  ) {
    return await this.groupService.update(id, dto);
  }
}
