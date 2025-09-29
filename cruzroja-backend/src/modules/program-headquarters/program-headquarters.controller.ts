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

@Controller('program-headquarters')
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

  @Put('/deactivate/:idProgram/:idHeadquarters')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Param('idProgram', ParseIntPipe) idProgram: number,
    @Param('idHeadquarters', ParseIntPipe) idHeadquarters: number,
  ) {
    return this.programHeadquartersService.deactivate(
      idProgram,
      idHeadquarters,
    );
  }
}
