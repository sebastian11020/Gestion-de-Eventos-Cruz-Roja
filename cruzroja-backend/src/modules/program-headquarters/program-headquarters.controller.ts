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
import { ProgramHeadquartersService } from './program-headquarters.service';
import { AssociateProgramHeadquarters } from './dto/associate-program-headquarters';
import { ChangeCoordinatorProgramsDto } from './dto/change-coordinator-program-headquarters.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@Controller('program-headquarters')
@UseGuards(SupabaseAuthGuard)
export class ProgramHeadquartersController {
  constructor(private programHeadquartersService: ProgramHeadquartersService) {}
  @Get('/all')
  async getAll() {
    return this.programHeadquartersService.getAllProgramHeadquartersDto();
  }

  @Post('associate')
  @HttpCode(HttpStatus.CREATED)
  async associate(@Body() dto: AssociateProgramHeadquarters) {
    return this.programHeadquartersService.createOrActivate(dto);
  }

  @Put('/deactivate/:idProgram')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('idProgram', ParseIntPipe) idProgram: number) {
    return this.programHeadquartersService.deactivate(idProgram);
  }

  @Post('/change-leader')
  @HttpCode(HttpStatus.OK)
  async changeLeader(@Body() dto: ChangeCoordinatorProgramsDto) {
    return await this.programHeadquartersService.changeCoordinator(dto);
  }
}
