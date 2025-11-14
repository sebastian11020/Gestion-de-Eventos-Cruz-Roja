import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { type_affiliation } from '../eps-person/enum/eps-person.enum';
import { CreateEpsPersonDTO } from '../eps-person/dto/create-eps-person.dto';
import { EpsPerson } from '../eps-person/entity/eps-person.entity';
import { PersonRole } from '../person-role/entity/person-role.entity';
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
import { SendEmailRegister } from '../email/dto/send-email.dto';
import { GetPersons } from './dto/get-person.dto';
import { GetLoginPersonDto } from './dto/get-login-person.dto';
import { PersonSkillService } from '../person-skill/person-skill.service';
import { PersonSkill } from '../person-skill/entity/person-skill.entity';
import { PersonRoleService } from '../person-role/person-role.service';
import { GetTableSpecialEvent } from './dto/get-table-special-event';
import { GetEventCardDDto } from '../event/dto/get-event.dto';
import { type_document } from './enum/person.enums';
import { UpdateProfilePersonDto } from './dto/update-profile-person.dto';
import { GetReportInactivityMonthlyDto } from './dto/get-report-monthly.dto';
import { GetReportUnlinked } from './dto/get-report-unlinked';
import { GetDashboardCards } from './dto/get-dashboard-cards';
import { Event } from '../event/entity/event.entity';
import { NotificationPersonService } from '../notification-person/notification-person.service';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private groupStatusService: GroupStatusService,
    private programStatusService: ProgramStatusService,
    private epsPersonService: EpsPersonService,
    private nodeEmailerService: EmailService,
    private personSkillService: PersonSkillService,
    private personRoleService: PersonRoleService,
    private notificationPersonService: NotificationPersonService,
  ) {}

  async getLoginPerson(id: string): Promise<GetLoginPersonDto> {
    const person = await this.personRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect(
        'p.person_roles',
        'current_role',
        'current_role.end_date IS NULL',
      )
      .leftJoinAndSelect(
        'p.person_status',
        'current_status',
        'current_status.end_date IS NULL',
      )
      .leftJoinAndSelect('current_status.state', 'state')
      .leftJoinAndSelect('current_role.role', 'role')
      .where('p.id = :id', { id })
      .getOne();
    assertFound(person, 'No se encontro ninguna persona con ese id');
    const current_state = person.person_status[0].state.name;
    const current_role = person.person_roles[0].role.name;
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
        person_status: {
          state: {
            id: 3,
          },
          end_date: IsNull(),
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

  async findPersonById(id: string): Promise<Person | null> {
    return await this.personRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        person_roles: {
          role: true,
        },
      },
    });
  }

  async findAllDto(user_id: string): Promise<GetPersons[]> {
    const person = await this.personRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect(
        'p.person_roles',
        'person_roles',
        'person_roles.end_date IS NULL',
      )
      .leftJoinAndSelect('person_roles.headquarters', 'headquarters')
      .leftJoinAndSelect('person_roles.role', 'role')
      .where('p.id = :id', { id: user_id })
      .getOne();
    assertFound(person, 'No se encontro ninguna persona con ese id');
    const persons = this.personRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.location', 'location')
      .leftJoinAndSelect('location.parent', 'parent_location')
      .leftJoinAndSelect(
        'p.person_status',
        'current_status',
        'current_status.end_date IS NULL',
      )
      .leftJoinAndSelect('current_status.state', 'state')
      .leftJoinAndSelect(
        'p.person_roles',
        'current_role',
        'current_role.end_date IS NULL',
      )
      .leftJoinAndSelect('current_role.headquarters', 'headquarters')
      .leftJoinAndSelect('headquarters.location', 'city')
      .leftJoinAndSelect('current_role.group', 'groups')
      .leftJoinAndSelect('current_role.program', 'programs')
      .leftJoinAndSelect(
        'p.eps_person',
        'eps_person',
        'eps_person.state = true',
      )
      .leftJoinAndSelect('eps_person.eps', 'eps')
      .leftJoinAndSelect('p.person_skills', 'skills', 'skills.state = true')
      .leftJoinAndSelect('skills.skill', 'skill')
      .leftJoinAndSelect('groups.group', 'group')
      .leftJoinAndSelect('programs.program', 'program');
    if (2 === person.person_roles[0].role.id) {
      persons.where('headquarters.id = :id', {
        id: person.person_roles[0].headquarters.id,
      });
    }
    const aux = await persons.getMany();
    return this.mapEntityToDto(aux);
  }

  mapEntityToDto(persons: Person[]): Promise<GetPersons[]> {
    return Promise.all(
      persons.map(async (p) => {
        const dto = new GetPersons();
        dto.id = p.id;
        dto.typeDocument = p.type_document;
        dto.document = p.document;
        dto.carnet = p.license ?? '';
        dto.name = FormatNamesString(p.name);
        dto.lastName = FormatNamesString(p.last_name);
        dto.bloodType = FormatNamesString(p.type_blood);
        dto.sex = FormatNamesString(p.sex);
        dto.gender = FormatNamesString(p.gender);
        dto.state = {
          id: String(p.person_status[0].state.id),
          name: FormatNamesString(p.person_status[0].state.name),
        };
        dto.bornDate = p.birth_date.toISOString().split('T')[0];
        dto.department = FormatNamesString(p.location.parent?.name ?? '');
        dto.city = {
          id: String(p.location.id),
          name: FormatNamesString(p.location.name),
        };
        dto.zone = FormatNamesString(p.address.zone);
        dto.address = FormatNamesString(p.address.streetAddress);
        dto.cellphone = String(p.phone);
        dto.emergencyContact = {
          name: FormatNamesString(p.emergency_contact.name),
          relationShip: FormatNamesString(p.emergency_contact.relationShip),
          phone: String(p.emergency_contact.phone),
        };
        dto.sectional = {
          id: String(p.person_roles[0].headquarters.id),
          city: FormatNamesString(p.person_roles[0].headquarters.location.name),
        };
        dto.eps = {
          id: String(p.eps_person[0]?.eps.id ?? ''),
          name: FormatNamesString(p.eps_person[0]?.eps.name ?? ''),
          type: FormatNamesString(p.eps_person[0]?.affiliation ?? ''),
        };
        dto.skills = p.person_skills.map((s) => ({
          id: String(s.skill.id),
          name: FormatNamesString(s.skill.name),
        }));
        dto.group = {
          id: String(p.person_roles[0].group?.group.id ?? ''),
          name: FormatNamesString(p.person_roles[0].group?.group.name ?? ''),
          program: {
            id: String(p.person_roles[0]?.program?.program.id ?? ''),
            name: FormatNamesString(
              p.person_roles[0].program?.program.name ?? '',
            ),
          },
        };
        dto.email = FormatNamesString(p.email);
        const { totalHours, monthHours } =
          await this.getHoursSummaryForPersonFromPersonRepo(p.id);
        dto.totalHours = String(totalHours);
        dto.monthHours = String(monthHours);
        return dto;
      }),
    );
  }

  private getMonthRange(year: number, month: number) {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
  }

  private async getHoursSummaryForPersonFromPersonRepo(
    personId: string,
    month?: number,
    year?: number,
  ): Promise<{ totalHours: number; monthHours: number }> {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();

    const { start, end } = this.getMonthRange(y, m);

    const qb = this.personRepository
      .createQueryBuilder('p')
      .leftJoin('p.event_enrollment', 'enrollment')
      .leftJoin('enrollment.event_attendances', 'att')
      .where('p.id = :personId', { personId })
      .andWhere('att.check_out IS NOT NULL')
      .select('COALESCE(SUM(att.total_hours), 0)', 'totalHours')
      .addSelect(
        `
      COALESCE(
        SUM(
          CASE
            WHEN att.check_in >= :startOfMonth
             AND att.check_in <= :endOfMonth
            THEN att.total_hours
            ELSE 0
          END
        ),
        0
      )
      `,
        'monthHours',
      )
      .setParameters({
        startOfMonth: start,
        endOfMonth: end,
      });

    const raw = await qb.getRawOne<{
      totalHours: string;
      monthHours: string;
    }>();

    return {
      totalHours: Number(raw?.totalHours ?? 0),
      monthHours: Number(raw?.monthHours ?? 0),
    };
  }

  async findByDocumentDto(document: string) {
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

  async findById(id: string) {
    const person = await this.personRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(person, 'No se encontro a la persona especificada');
    const rows: GetPersons[] = await this.personRepository.query(
      'select * from public.get_person_flat_by_document($1)',
      [person.document],
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
      await this.associateSkills(manager, dto.skills, dto.id);
      //await this.sendEmail(dto.email, dto.password);
      return { success: true, message: 'Persona creada exitosamente.' };
    });
  }

  async sendEmail(email: string, password: string): Promise<void> {
    const send = new SendEmailRegister();
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
      await this.associateStatus(manager, id, dto.id_state);
      await this.checkCurrentRolePerson(
        manager,
        id,
        dto.id_headquarters,
        dto.id_state,
        dto.id_group,
        dto.id_program,
      );
      await this.associateEps(manager, id, dto.id_eps, dto.type_affiliation);
      await this.associateSkills(manager, dto.skills, id);
      return { success: true, message: 'Persona actualizada exitosamente.' };
    });
  }

  async updateProfile(id_person: string, dto: UpdateProfilePersonDto) {
    return this.personRepository.manager.transaction(async (manager) => {
      await manager.update(Person, id_person, {
        phone: dto.phone,
        emergency_contact: {
          name: NormalizeString(dto.emergencyContact.name),
          relationShip: NormalizeString(dto.emergencyContact.relationShip),
          phone: dto.emergencyContact.phone,
        },
        address: {
          streetAddress: NormalizeString(dto.address.streetAddress),
          zone: NormalizeString(dto.address.zone),
        },
        location: {
          id: dto.id_location,
        },
      });
      await this.associateEps(
        manager,
        id_person,
        dto.id_eps,
        dto.type_affiliation,
      );
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
        await manager.update(
          EpsPerson,
          { id_eps, id_person },
          {
            affiliation: affiliation,
            state: true,
          },
        );
      } else {
        if (!currentEps.state) {
          await manager.update(EpsPerson, currentEps.id_eps, {
            state: true,
          });
        }
      }
    } else {
      await this.closeEpsPerson(manager, id_eps, id_person);
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
    const newRole = manager.create(PersonRole, {
      person: {
        id: id_person,
      },
      headquarters: {
        id: id_headquarters,
      },
      role: {
        id: 5,
      },
      group: id_group
        ? {
            group: {
              id: id_group,
            },
            headquarters: {
              id: id_headquarters,
            },
          }
        : undefined,
      program: id_program
        ? {
            program: {
              id: id_program,
            },
            headquarters: {
              id: id_headquarters,
            },
          }
        : undefined,
    });
    await manager.getRepository(PersonRole).insert(newRole);
  }

  private async associateSkills(
    manager: EntityManager,
    ids_skills: number[],
    id_person: string,
  ) {
    let currentSkills =
      await this.personSkillService.getSkillsPerson(id_person);
    for (const id_skill of ids_skills) {
      const personSkill = await this.personSkillService.findByIds(
        id_person,
        id_skill,
      );
      if (personSkill) {
        currentSkills = currentSkills.filter(
          (ps) => ps.id_skill != personSkill?.id_skill,
        );
        if (!personSkill.state) {
          await manager.update(
            PersonSkill,
            { id_skill, id_person },
            {
              state: true,
            },
          );
        }
      } else {
        await manager.save(
          manager.create(PersonSkill, {
            person: {
              id: id_person,
            },
            skill: {
              id: id_skill,
            },
          }),
        );
      }
    }
    if (currentSkills.length > 0)
      await this.deactivateSkill(manager, currentSkills, id_person);
  }

  private async deactivateSkill(
    manager: EntityManager,
    person_skills: PersonSkill[],
    id_person: string,
  ) {
    for (const person_skill of person_skills) {
      const id_skill = person_skill.id_skill;
      await manager.update(
        PersonSkill,
        { id_skill, id_person },
        {
          state: false,
        },
      );
    }
  }

  private async checkCurrentRolePerson(
    manager: EntityManager,
    id_person: string,
    id_headquarters: number,
    id_state: number,
    id_group?: number,
    id_program?: number,
  ) {
    const norm = (v?: number | null) =>
      v === undefined || v === null ? null : Number(v);
    const currentRole =
      await this.personRoleService.findPersonCurrentRole(id_person);
    if (!currentRole) {
      await this.associateRole(
        manager,
        id_person,
        id_headquarters,
        id_group,
        id_program,
      );
    } else {
      const samePlacement =
        currentRole.headquarters.id === id_headquarters &&
        norm(currentRole.group?.id) === norm(id_group) &&
        norm(currentRole.group?.id) === norm(id_program) &&
        id_state != 3;
      if (!samePlacement) {
        await manager.update(PersonRole, currentRole.id, {
          end_date: new Date(),
        });
        await this.associateRole(
          manager,
          id_person,
          id_headquarters,
          id_group,
          id_program,
        );
      }
    }
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

  async thereAreActiveVolunteers(idHeadquarters: number) {
    const volunteers = await this.personRepository.count({
      where: {
        person_roles: {
          headquarters: {
            id: idHeadquarters,
          },
          end_date: IsNull(),
        },
        person_status: {
          end_date: IsNull(),
          state: {
            name: In(['ACTIVO', 'FORMACION', 'LICENCIA']),
          },
        },
      },
    });
    return volunteers > 0;
  }

  async getTableSpecialEvent() {
    const rows = await this.personRepository.find({
      where: {
        person_status: {
          state: {
            id: 3,
          },
          end_date: IsNull(),
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
      const dto = new GetTableSpecialEvent();
      dto.id = String(row.id);
      dto.name =
        FormatNamesString(row.name) + ' ' + FormatNamesString(row.last_name);
      dto.document = row.document;
      dto.email = FormatNamesString(row.email);
      return dto;
    });
  }

  async sendNotification(
    id_headquarters: number,
    event: GetEventCardDDto,
    id_notification: number,
  ) {
    const persons = await this.personRepository.find({
      where: {
        person_roles: {
          end_date: IsNull(),
          headquarters: {
            id: id_headquarters,
          },
          role: {
            id: 5,
          },
        },
        person_status: {
          state: {
            id: 3,
          },
          end_date: IsNull(),
        },
      },
      select: {
        email: true,
        id: true,
      },
    });
    if (persons.length > 0) {
      console.log(persons[0]);
      const emails = Array.from(
        new Set(
          persons
            .map((p) => (p.email ?? '').trim())
            .filter((e) => e && e.includes('@')),
        ),
      );
      const ids = Array.from(new Set(persons.map((p) => p.id)));
      await this.notificationPersonService.createNotificationPerson(
        ids,
        id_notification,
      );
      //await this.nodeEmailerService.sendEmailNewEventMany(emails, event);
    }
  }

  async getSkills(id_user: string) {
    const person = await this.personRepository.findOne({
      where: {
        id: id_user,
        person_skills: {
          state: true,
        },
      },
      relations: {
        person_skills: {
          skill: true,
        },
      },
    });
    assertFound(person, 'No se encontro a la persona especificada');
    const skills = person.person_skills;
    return skills?.map((skill) => {
      return skill.skill.id;
    });
  }

  async is_adult(id: string) {
    const person = await this.personRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(person, 'No se encontro a la persona especificada');
    return !(person.type_document === type_document.TI);
  }

  async reportInactivityPerson(
    user_id: string,
  ): Promise<GetReportInactivityMonthlyDto[]> {
    const leader = await this.findPersonReport(user_id);
    assertFound(leader, 'Esta persona no es lider de ninguna sede');
    const activeRole = leader.person_roles.find((r) => !r.end_date);
    assertFound(activeRole, 'No se encontro un rol activo para la persona');
    return await this.personRepository.query(
      'select * from public.get_report_inactivity_monthly($1)',
      [activeRole.headquarters.id],
    );
  }

  async reportUnlinkedPerson(user_id: string): Promise<GetReportUnlinked> {
    const leader = await this.findPersonReport(user_id);
    assertFound(leader, 'Esta persona no es lider de ninguna sede');
    const activeRole = leader.person_roles.find((r) => !r.end_date);
    assertFound(activeRole, 'No se encontro un rol activo para la persona');
    return await this.personRepository.query(
      'select * from public.get_inactive_volunteers_by_headquarters($1)',
      [activeRole.headquarters.id],
    );
  }

  async findPersonReport(user_id: string): Promise<Person | null> {
    return await this.personRepository.findOne({
      where: {
        id: user_id,
        person_roles: {
          end_date: IsNull(),
          role: {
            id: In([1, 2, 6]),
          },
        },
      },
      relations: {
        person_roles: {
          headquarters: true,
        },
      },
    });
  }
  async searchLeaderSectionalById() {
    return await this.personRepository.findOne({
      where: {
        person_roles: {
          role: {
            id: 1,
          },
          end_date: IsNull(),
        },
      },
    });
  }

  async getDashboardCards() {
    return await this.personRepository.manager.transaction(async (manager) => {
      const users = await manager.find(Person, {
        where: {
          person_status: {
            state: {
              id: 3,
            },
            end_date: IsNull(),
          },
        },
      });
      const leader = await this.searchLeaderSectionalById();
      const coordinatorsGroups = await manager.find(Person, {
        where: {
          person_status: {
            state: {
              id: 3,
            },
            end_date: IsNull(),
          },
          person_roles: {
            role: {
              id: 3,
            },
            end_date: IsNull(),
          },
        },
      });
      const coordinatorsPrograms = await manager.find(Person, {
        where: {
          person_status: {
            state: {
              id: 3,
            },
            end_date: IsNull(),
          },
          person_roles: {
            role: {
              id: 4,
            },
            end_date: IsNull(),
          },
        },
      });
      const volunteers = await manager.find(Person, {
        where: {
          person_status: {
            state: {
              id: 3,
            },
            end_date: IsNull(),
          },
          person_roles: {
            role: {
              id: 5,
            },
            end_date: IsNull(),
          },
        },
      });
      const activeEvents = await manager.find(Event, {
        where: {
          eventStatus: {
            state: {
              id: In([8, 9]),
            },
            end_date: IsNull(),
          },
        },
      });
      assertFound(leader, 'No se encontro lider de seccional');
      const dto = new GetDashboardCards();
      dto.total_user = String(users.length);
      dto.leader =
        FormatNamesString(leader.name) +
        ' ' +
        FormatNamesString(leader.last_name);
      dto.total_coordinators_group = String(coordinatorsGroups.length);
      dto.total_coordinators_program = String(coordinatorsPrograms.length);
      dto.total_volunteers = String(volunteers.length);
      dto.active_events = String(activeEvents.length);
      return dto;
    });
  }

  async getDashBoardVolunteer(user_id: string) {
    const user = await this.personRepository.findOne({
      where: {
        id: user_id,
      },
      relations: {
        person_roles: {
          headquarters: true,
        },
      },
    });
    assertFound(user, 'No se encontro la persona indicada');
    const activeRole = user.person_roles.find((r) => !r.end_date);
    assertFound(activeRole, 'No se encontro un rol activo para la persona');
    const dto: {
      name: string;
      hours_month: string;
    } = await this.personRepository.query(
      'select * from public.top10_volunteers_hours_month($1)',
      [activeRole.headquarters.id],
    );
    return dto;
  }
}
