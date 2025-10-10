import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { type_affiliation } from '../eps-person/enum/eps-person.enum';
import { CreateEpsPersonDTO } from '../eps-person/dto/create-eps-person.dto';
import { EpsPerson } from '../eps-person/entity/eps-person.entity';
import { CreatePersonRoleDto } from '../person-role/dto/create-person-rol.dto';
import { PersonRole } from '../person-role/entity/person-role.entity';
import { GroupHeadquarters } from '../group-headquarters/entity/group-headquarters.entity';
import { ProgramHeadquarters } from '../program-headquarters/entity/program-headquarters.entity';
import { Role } from '../role/entity/role.entity';
import { Headquarters } from '../headquarters/entity/headquarters.entity';
import { assertFound } from '../../common/utils/assert';
import { PersonStatus } from '../person-status/entity/person-status.entity';
import { GetPersonTableDto } from './dto/get-person-table.dto';
import { FormatNamesString } from '../../common/utils/string.utils';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async findAllDtoTable() {
    const rows = await this.personRepository.find({
      relations: {
        person_status: {
          state: true,
        },
        person_roles: {
          program: {
            program: true,
          },
          group: {
            group: true,
          },
        },
      },
    });
    return rows.map((row) => {
      const dto = new GetPersonTableDto();
      dto.typeDocument = FormatNamesString(row.type_document);
      dto.document = FormatNamesString(row.document);
      dto.name = FormatNamesString(row.name) + ' ' + FormatNamesString(row.last_name);
      const openState = row.person_status.find((ps) => ps.end_date == null);
      dto.state = openState
        ? FormatNamesString(openState.state?.name ?? '')
        : '';
      const activeRole = row.person_roles.find(r => r.end_date == null);
      dto.program = FormatNamesString(activeRole?.program?.program?.name ?? '');
      dto.group = FormatNamesString(activeRole?.group?.group?.name ?? '');
      return dto;
    });
  }

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
        location: {
          id: dto.id_location,
        },
      });
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
      await this.associateRoleInitial(
        manager,
        dto.id,
        dto.id_headquarters,
        dto.id_group,
        dto.id_program,
      );
      await this.associateStatusInitial(manager, dto.id, dto.id_state);
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

  private async associateRoleInitial(
    manager: EntityManager,
    id_person: string,
    id_headquarters: number,
    id_group?: number,
    id_program?: number,
  ) {
    const dto = new CreatePersonRoleDto();
    dto.id_role = 5;
    dto.id_person = id_person;
    dto.id_headquarters = id_headquarters;
    if (id_group) {
      dto.id_group_headquarters = await this.verifiedGroupStatus(
        manager,
        id_headquarters,
        id_group,
      );
    }
    if (id_program) {
      dto.id_program_headquarters = await this.verifiedProgramStatus(
        manager,
        id_headquarters,
        id_program,
      );
    }
    await manager
      .getRepository(PersonRole)
      .insert(this.createRolePerson(manager, dto));
  }

  private createRolePerson(manager: EntityManager, dto: CreatePersonRoleDto) {
    const personStub = manager
      .getRepository(Person)
      .create({ id: dto.id_person });
    const roleStub = manager.getRepository(Role).create({ id: dto.id_role });
    const headquartersStub = manager
      .getRepository(Headquarters)
      .create({ id: dto.id_headquarters });
    const groupHeadquartersStub = manager
      .getRepository(GroupHeadquarters)
      .create({ id: dto.id_group_headquarters });
    const programHeadquartersStub = manager
      .getRepository(ProgramHeadquarters)
      .create({ id: dto.id_program_headquarters });
    return manager.create(PersonRole, {
      person: personStub,
      role: roleStub,
      headquarters: headquartersStub,
      ...(groupHeadquartersStub ? { group: groupHeadquartersStub } : {}),
      ...(programHeadquartersStub ? { program: programHeadquartersStub } : {}),
    });
  }

  private async verifiedGroupStatus(
    manager: EntityManager,
    id_headquarters: number,
    id_group: number,
  ) {
    const gh = await manager.findOne(GroupHeadquarters, {
      where: {
        group: {
          id: id_group,
        },
        headquarters: {
          id: id_headquarters,
        },
      },
    });
    assertFound(gh, 'No se encontro la agrupacion en la sede especificada');
    return gh.id;
  }

  private async verifiedProgramStatus(
    manager: EntityManager,
    id_headquarters: number,
    id_program: number,
  ) {
    const ph = await manager.findOne(ProgramHeadquarters, {
      where: {
        program: {
          id: id_program,
        },
        headquarters: {
          id: id_headquarters,
        },
      },
    });
    assertFound(ph, 'No se encontro el programa en la sede especificada');
    return ph.id;
  }

  private async associateStatusInitial(
    manager: EntityManager,
    id_person: string,
    id_state: number,
  ) {
    const person_state = manager.create(PersonStatus, {
      person: {
        id: id_person,
      },
      state: {
        id: id_state,
      },
    });
    console.log('Estado creado');
    console.log(person_state);
    await manager.save(person_state);
  }
}
