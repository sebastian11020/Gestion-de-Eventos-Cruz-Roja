import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './entity/person.entity';
import { GetPersonTableDto } from './dto/get-person-table.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('/all')
  async getAll(): Promise<Person[]> {
    return this.personService.findAllDto();
  }

  @Get('/table/all')
  async getTableAll(): Promise<GetPersonTableDto[]> {
    return this.personService.findAllDtoTable();
  }

  @Post('/create')
  async create(@Body() personDto: CreatePersonDto) {
    return this.personService.create(personDto);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() personDto: UpdatePersonDto) {
    return this.personService.update(id, personDto);
  }
}
