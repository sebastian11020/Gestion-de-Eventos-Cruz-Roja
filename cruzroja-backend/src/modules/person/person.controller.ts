import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { GetPersonTableDto } from './dto/get-person-table.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';
import { UserId } from '../../common/decorators/user.decorator';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('/login/:id')
  async getLogin(@Param('id') id: string) {
    return this.personService.getLoginPerson(id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('/all')
  async getAll() {
    return this.personService.findAllDto();
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/leaderinfo/:document')
  async getLeaderInfo(@Param('document') document: string) {
    return this.personService.findByDocumentDto(document);
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/profile/')
  async getProfileInfo(@UserId() userId: string) {
    return this.personService.findByDocumentDto(userId);
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/table/all')
  async getTableAll(): Promise<GetPersonTableDto[]> {
    return this.personService.findAllDtoTable();
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/table/special-event')
  async getTableSpecialEvent() {
    return this.personService.getTableSpecialEvent();
  }
  @UseGuards(SupabaseAuthGuard)
  @Post('/create')
  async create(@Body() personDto: CreatePersonDto) {
    return this.personService.create(personDto);
  }
  @UseGuards(SupabaseAuthGuard)
  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() personDto: UpdatePersonDto) {
    return this.personService.update(id, personDto);
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/skills')
  async getSkills(@Query('id_user') id_user: string) {
    return this.personService.getSkills(id_user);
  }
}
