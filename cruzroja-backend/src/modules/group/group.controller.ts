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
  async findAll(): Promise<GetGroupDto[]> {
    return this.groupService.getAllDto();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(dto: CreateGroupDto) {
    return this.groupService.create(dto);
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupService.update(id, dto);
  }
}
