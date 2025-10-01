import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { EpsPersonService } from '../eps-person/eps-person.service';
import { type_affiliation } from '../eps-person/enum/eps-person.enum';
import { CreateEpsPersonDTO } from '../eps-person/dto/create-eps-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private epsPersonService: EpsPersonService,
  ) {}

  async findAllDto(): Promise<Person[]> {
    return this.personRepository.find();
  }

  async create(dto: CreatePersonDto) {
    const person: Person = this.personRepository.create({
      id: dto.id,
      type_document: dto.type_document,
      document: dto.document,
      name: dto.name,
      last_name: dto.lastName,
      email: dto.email,
      sex: dto.sex,
      gender: dto.gender,
      phone: dto.phone,
      emergency_contact: {
        name: dto.emergencyContact.name,
        relationShip: dto.emergencyContact.relationShip,
        phone: dto.emergencyContact.phone,
      },
      blood: dto.blood,
      birth_date: dto.birthDate,
      address: {
        streetAddress: dto.address.streetAddress,
        zone: dto.address.zone,
      },
      headquarters: {
        id: dto.id_headquarter,
      },
      location: {
        id: dto.id_location,
      },
    });
    if (dto.id_group) {
      person.group.id = dto.id_group;
    }
    if (dto.id_program) {
      person.program.id = dto.id_program;
    }
    if (dto.carnet) {
      person.license = dto.carnet;
    }
    await this.personRepository.save(person);
    await this.associateEps(dto.id, dto.id_eps, dto.type_affiliation);
    return { success: true };
  }

  private async associateEps(
    id_person: string,
    id_eps: number,
    affiliation: type_affiliation,
  ) {
    const dto = new CreateEpsPersonDTO();
    dto.id_person = id_person;
    dto.id_eps = id_eps;
    dto.affiliation = affiliation;
    await this.epsPersonService.create(dto);
  }
}
