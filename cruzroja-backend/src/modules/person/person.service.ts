import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
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
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GroupStatusService } from '../group-status/group-status.service';
import { ProgramStatusService } from '../program-status/program-status.service';
import { UpdatePersonDto } from './dto/update-person.dto';
import { EpsPersonService } from '../eps-person/eps-person.service';
import { EmailService } from '../email/email.service';
import { SendEmail } from '../email/dto/send-email.dto';
import { GetPersons } from './dto/get-person.dto';
import { GetLoginPersonDto } from './dto/get-login-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private groupStatusService: GroupStatusService,
    private programStatusService: ProgramStatusService,
    private epsPersonService: EpsPersonService,
    private nodeEmailerService: EmailService,
  ) {}

  async getLoginPerson(id: string): Promise<GetLoginPersonDto> {
    const person = await this.personRepository.findOne({
      where: {
        id: id,
        person_roles: {
          end_date: IsNull(),
        },
        person_status: {
          end_date: IsNull(),
        },
      },
      relations: {
        person_roles: {
          role: true,
        },
        person_status: {
          state: true,
        },
      },
    });
    assertFound(person, 'No se encontro ninguna persona con ese id');
    const current_state = person.person_status.at(0)?.state.name;
    const current_role = person.person_roles.at(0)?.role.name ?? '';
    const role =
      !current_role ||
      current_state === 'INACTIVO' ||
      current_state === 'DESVINCULADO'
        ? ''
        : current_role;
    return {
      name: FormatNamesString(person.name),
      lastName: FormatNamesString(person.last_name),
      role: role,
    };
  }

  async findAllDtoTable() {
    const rows = await this.personRepository.find({
      where: {
        person_roles: {
          role: {
            id: 5,
          },
          end_date: IsNull(),
        },
        person_status: {
          state: {
            id: 3,
          },
        },
      },
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
      dto.name =
        FormatNamesString(row.name) + ' ' + FormatNamesString(row.last_name);
      const openState = row.person_status.find((ps) => ps.end_date == null);
      dto.state = openState
        ? FormatNamesString(openState.state?.name ?? '')
        : '';
      const activeRole = row.person_roles.find((r) => r.end_date == null);
      dto.program = FormatNamesString(activeRole?.program?.program?.name ?? '');
      dto.group = FormatNamesString(activeRole?.group?.group?.name ?? '');
      return dto;
    });
  }

  async findAllDto() {
    const rows: GetPersons[] = await this.personRepository.query(
      'select * from public.list_people_form_state()',
    );
    return rows;
  }

  async findByIdDto(document: string) {
    const rows: GetPersons[] = await this.personRepository.query(
      'select * from public.get_person_flat_by_document($1)',
      [document],
    );
    return {
      success: true,
      message: 'Informacion cargada con exito',
      leader: rows.at(0),
    };
  }

  async create(dto: CreatePersonDto) {
    return this.personRepository.manager.transaction(async (manager) => {
      const person: Person = manager.create(Person, {
        id: dto.id,
        type_document: dto.type_document,
        document: dto.document,
        name: NormalizeString(dto.name),
        last_name: NormalizeString(dto.lastName),
        email: NormalizeString(dto.email),
        sex: dto.sex,
        gender: dto.gender,
        phone: dto.phone,
        emergency_contact: {
          name: NormalizeString(dto.emergencyContact.name),
          relationShip: NormalizeString(dto.emergencyContact.relationShip),
          phone: dto.emergencyContact.phone,
        },
        type_blood: dto.blood,
        birth_date: dto.birthDate,
        address: {
          streetAddress: NormalizeString(dto.address.streetAddress),
          zone: NormalizeString(dto.address.zone),
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
      await this.associateRole(
        manager,
        dto.id,
        dto.id_headquarters,
        dto.id_group,
        dto.id_program,
      );
      await this.associateStatus(manager, dto.id, dto.id_state);
      await this.sendEmail(dto.email, dto.password);
      return { success: true, message: 'Persona creada exitosamente.' };
    });
  }

  async sendEmail(email: string, password: string): Promise<void> {
    const send = new SendEmail();
    send.email = email;
    send.password = password;
    await this.nodeEmailerService.sendEmailRegister(send);
  }

  async update(id: string, dto: UpdatePersonDto) {
    return this.personRepository.manager.transaction(async (manager) => {
      await manager.update(Person, id, {
        type_document: dto.type_document,
        document: dto.document,
        name: NormalizeString(dto.name),
        last_name: NormalizeString(dto.lastName),
        email: NormalizeString(dto.email),
        sex: dto.sex,
        gender: dto.gender,
        license: dto.carnet,
        phone: dto.phone,
        emergency_contact: {
          name: NormalizeString(dto.emergencyContact.name),
          relationShip: NormalizeString(dto.emergencyContact.relationShip),
          phone: dto.emergencyContact.phone,
        },
        type_blood: dto.blood,
        birth_date: dto.birthDate,
        address: {
          streetAddress: NormalizeString(dto.address.streetAddress),
          zone: NormalizeString(dto.address.zone),
        },
        location: {
          id: dto.id_location,
        },
      });
      await this.associateEps(manager, id, dto.id_eps, dto.type_affiliation);
      await this.associateStatus(manager, id, dto.id_state);
      return { success: true, message: 'Persona actualizada exitosamente.' };
    });
  }

  private async associateEps(
    manager: EntityManager,
    id_person: string,
    id_eps: number,
    affiliation: type_affiliation,
  ) {
    const currentEps = await this.epsPersonService.findByIds(id_person, id_eps);
    if (currentEps) {
      if (affiliation != currentEps.affiliation) {
        await this.closeEpsPerson(manager, id_eps, id_person);
        const dto = new CreateEpsPersonDTO();
        dto.id_person = id_person;
        dto.id_eps = id_eps;
        dto.affiliation = affiliation;
        await manager.save(manager.create(EpsPerson, dto));
      }
    } else {
      const dto = new CreateEpsPersonDTO();
      dto.id_person = id_person;
      dto.id_eps = id_eps;
      dto.affiliation = affiliation;
      await manager.save(manager.create(EpsPerson, dto));
    }
  }

  private async closeEpsPerson(
    manager: EntityManager,
    id_eps: number,
    id_person: string,
  ) {
    await manager.update(
      EpsPerson,
      { id_person, id_eps },
      {
        state: false,
      },
    );
  }

  private async associateRole(
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
      dto.id_group_headquarters = await this.checkGroupStatus(
        id_headquarters,
        id_group,
      );
    }
    if (id_program) {
      dto.id_program_headquarters = await this.checkProgramStatus(
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

  private async checkGroupStatus(id_headquarters: number, id_group: number) {
    const gh = await this.groupStatusService.findOneOpenStateByIdsFk(
      id_headquarters,
      id_group,
    );
    assertFound(gh, 'No se encontro la agrupacion en la sede especificada');
    return gh.id;
  }

  private async checkProgramStatus(
    id_headquarters: number,
    id_program: number,
  ) {
    const ph = await this.programStatusService.findOneOpenStateByIdsFk(
      id_headquarters,
      id_program,
    );
    assertFound(ph, 'No se encontro el programa en la sede especificada');
    return ph.id;
  }

  private async associateStatus(
    manager: EntityManager,
    id_person: string,
    id_state: number,
  ) {
    let person_state = await manager.findOne(PersonStatus, {
      where: {
        person: {
          id: id_person,
        },
        end_date: IsNull(),
      },
      relations: {
        state: true,
      },
    });
    if (!person_state) {
      person_state = manager.create(PersonStatus, {
        person: {
          id: id_person,
        },
        state: {
          id: id_state,
        },
      });
      await manager.save(person_state);
    } else {
      if (person_state.state.id != id_state) {
        await manager.update(PersonStatus, person_state.id, {
          end_date: new Date(),
        });
        person_state = manager.create(PersonStatus, {
          person: {
            id: id_person,
          },
          state: {
            id: id_state,
          },
        });
        await manager.save(person_state);
      }
    }
  }
}
