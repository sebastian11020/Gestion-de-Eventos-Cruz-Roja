import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('role')
@UseGuards(SupabaseAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('/all')
  async getAll() {
    return this.roleService.getAllDto();
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }
}
