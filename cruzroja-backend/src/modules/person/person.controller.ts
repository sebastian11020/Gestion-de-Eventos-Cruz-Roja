import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { GetPersonTableDto } from './dto/get-person-table.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('/login/:id')
  async getLogin(@Param('id') id: string) {
    return this.personService.getLoginPerson(id);
  }

  @Get('/all')
  async getAll() {
    return this.personService.findAllDto();
  }

  @Get('/leaderinfo/:document')
  async getLeaderInfo(@Param('document') document: string) {
    return this.personService.findByIdDto(document);
  }

  @Get('/table/all')
  async getTableAll(): Promise<GetPersonTableDto[]> {
    return this.personService.findAllDtoTable();
  }

  @Get('/table/special-event')
  async getTableSpecialEvent() {
    return this.personService.getTableSpecialEvent();
  }

  @Post('/create')
  async create(@Body() personDto: CreatePersonDto) {
    return this.personService.create(personDto);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() personDto: UpdatePersonDto) {
    return this.personService.update(id, personDto);
  }

  @Get('/skills')
  async getSkills(@Query('id_user') id_user: string) {
    return this.personService.getSkills(id_user);
  }
}
