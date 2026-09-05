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
import { ProgramHeadquartersService } from './program-headquarters.service';
import { AssociateProgramHeadquarters } from './dto/associate-program-headquarters';
import { ChangeCoordinatorProgramsDto } from './dto/change-coordinator-program-headquarters.dto';
import { UserId } from '../../common/decorators/user.decorator';

@Controller('program-headquarters')
export class ProgramHeadquartersController {
  constructor(private programHeadquartersService: ProgramHeadquartersService) {}
  @Get('/all')
  async getAll(@UserId() userId: string) {
    return this.programHeadquartersService.getAllProgramHeadquartersDto(userId);
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
