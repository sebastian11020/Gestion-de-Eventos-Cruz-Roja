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
import { GroupHeadquartersService } from './group-headquarters.service';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';
import { ChangeCoordinatorGroupHeadquartersDto } from './dto/change-coordinator-group-headquarters.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('group-headquarters')
@UseGuards(SupabaseAuthGuard)
export class GroupHeadquartersController {
  constructor(private groupHeadquartersService: GroupHeadquartersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async findAllGroupHeadquarters() {
    return this.groupHeadquartersService.getAllGroupHeadquartersDto();
  }

  @Get('/table/:programId')
  async getTable(@Param('programId', ParseIntPipe) programId: number) {
    return await this.groupHeadquartersService.getInfoTable(programId);
  }

  @Post('/associate')
  @HttpCode(HttpStatus.CREATED)
  async associate(@Body() dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersService.createOrActivate(dto);
  }

  @Put('/deactivate/:idGroup/:idHeadquarters')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('idGroup', ParseIntPipe) idGroup: number,
    @Param('idHeadquarters', ParseIntPipe) idHeadquarters: number,
  ) {
    return this.groupHeadquartersService.deactivate(idGroup, idHeadquarters);
  }

  @Post('/change-leader')
  @HttpCode(HttpStatus.OK)
  async changeLeader(@Body() dto: ChangeCoordinatorGroupHeadquartersDto) {
    return await this.groupHeadquartersService.changeCoordinator(dto);
  }
}
