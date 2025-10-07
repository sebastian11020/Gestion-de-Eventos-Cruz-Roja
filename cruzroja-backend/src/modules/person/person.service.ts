import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { EpsPersonService } from '../eps-person/eps-person.service';
import { type_affiliation } from '../eps-person/enum/eps-person.enum';
import { CreateEpsPersonDTO } from '../eps-person/dto/create-eps-person.dto';
import { EpsPerson } from '../eps-person/entity/eps-person.entity';
import { Groups } from '../group/entity/groups.entity';
import { assertFound } from '../../common/utils/assert';
import { Program } from '../program/entity/program.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async findAllDto(): Promise<Person[]> {
    return this.personRepository.find();
  }

  async create(dto: CreatePersonDto) {
    return this.personRepository.manager.transaction(async (manager) => {
      const person: Person = manager.create(Person, {
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
        type_blood: dto.blood,
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
        person.group = await this.associateGroup(manager, dto.id_group);
      }
      if (dto.id_program) {
        person.program = await this.associateProgram(manager, dto.id_program);
      }
      if (dto.carnet) {
        person.license = dto.carnet;
      }
      await manager.save(person);
      await this.associateEps(
        manager,
        dto.id,
        dto.id_eps,
        dto.type_affiliation,
      );
      return { success: true, message: 'Persona creada exitosamente.' };
    });
  }

  private async associateEps(
    manager: EntityManager,
    id_person: string,
    id_eps: number,
    affiliation: type_affiliation,
  ) {
    const dto = new CreateEpsPersonDTO();
    dto.id_person = id_person;
    dto.id_eps = id_eps;
    dto.affiliation = affiliation;
    await manager.save(manager.create(EpsPerson, dto));
  }

  private async associateGroup(
    manager: EntityManager,
    id_group?: number,
  ): Promise<Groups> {
    const group = await manager.findOne(Groups, {
      where: { id: id_group },
    });
    assertFound(group);
    return group;
  }

  private async associateProgram(
    manager: EntityManager,
    id_program: number,
  ): Promise<Program> {
    const program = await manager.findOne(Program, {
      where: { id: id_program },
    });
    assertFound(program);
    return program;
  }
}
