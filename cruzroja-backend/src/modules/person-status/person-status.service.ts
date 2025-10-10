import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonStatus } from './entity/person-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonStatusService {
  constructor(
    @InjectRepository(PersonStatus)
    private personRepository: Repository<PersonStatus>,
  ) {}
}
