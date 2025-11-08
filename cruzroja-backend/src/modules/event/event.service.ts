import { Injectable } from '@nestjs/common';
import { Event, Event as EventEntity } from './entity/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventForm, SkillQuota } from './dto/create-event.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GroupHeadquartersService } from '../group-headquarters/group-headquarters.service';
import { GetEventCardDDto, GetSkillQuota } from './dto/get-event.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';
import { EntityManager, Repository } from 'typeorm';
import { Person } from '../person/entity/person.entity';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import { EventStatusService } from '../event-status/event-status.service';
import { EventStatus } from '../event-status/entity/event-status.entity';
import { EventQuota } from '../event-quota/entity/event-quota.entity';
import { PersonService } from '../person/person.service';
import { EventEnrollment } from '../event-enrollment/entity/event-enrollment.entity';
import { EventAttendance } from '../event_attendance/entity/event_attendance.entity';
import { EditEventDto } from './dto/edit-event.dto';
import { GetEventCalendarDto } from './dto/get-event-calendar';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private groupHeadquartersService: GroupHeadquartersService,
    private eventStatusService: EventStatusService,
    private personService: PersonService,
    private notificationService: NotificationService,
  ) {}

  async create(eventForm: CreateEventForm) {
    return this.eventRepository.manager.transaction(async (manager) => {
      let state = 8;
      const idGroupHeadquarters =
        await this.groupHeadquartersService.findOneById(
          eventForm.sectionalId,
          eventForm.groupId,
        );
      const coordinatorEvent = await manager.findOne(Person, {
        where: {
          document: eventForm.attendant,
        },
      });
      assertFound(coordinatorEvent, 'No se encontro el encargado especificado');
      let newEvent = manager.create(EventEntity, {
        name: NormalizeString(eventForm.name),
        description: NormalizeString(eventForm.description),
        start_date: eventForm.startDate,
        estimated_end_date: eventForm.endDate,
        is_virtual: eventForm.isVirtual,
        decree_1809_applies: eventForm.applyDecreet,
        is_private: eventForm.isPrivate,
        is_adult: eventForm.isAdult,
        is_emergency: eventForm.isEmergency,
        max_volunteers: eventForm.capacity,
        street_address: NormalizeString(eventForm.streetAddress),
        location: {
          id: eventForm.city,
        },
        scope: {
          id: eventForm.ambit,
        },
        classificationEvent: {
          id: eventForm.classification,
        },
        eventFrame: {
          id: eventForm.marcActivity,
        },
        person: {
          id: coordinatorEvent.id,
        },
        headquarters: {
          id: eventForm.sectionalId,
        },
        groupHeadquarters: {
          id: idGroupHeadquarters?.id ?? undefined,
        },
      });
      newEvent = await manager.save(EventEntity, newEvent);
      await this.enrollmentCoordinatorEvent(
        manager,
        newEvent.id,
        coordinatorEvent.id,
      );
      if (newEvent.is_private) {
        const participants = eventForm.participants;
        assert(
          participants,
          'Para crear un evento privado, tienes que agregar los participantes',
        );
        if (participants.length > eventForm.capacity - 1) {
          conflict(
            'No se pueden registrar mas voluntarios de los indicados en el formulario.',
          );
        }

        await this.assignSkillQuota(manager, newEvent.id, [
          {
            id: 3,
            qty: eventForm.capacity,
          },
        ]);
        await this.privateEvent(
          manager,
          newEvent.id,
          participants,
          newEvent.start_date,
          newEvent.estimated_end_date,
        );
        state = 10;
      } else {
        await this.assignSkillQuota(
          manager,
          newEvent.id,
          eventForm.skillsQuotasList,
        );
      }
      await this.assignStatus(manager, newEvent.id, state);
      const notification =
        await this.notificationService.createNotificationNewEvent(
          eventForm.name,
        );
      await this.sendNotification(
        manager,
        eventForm.sectionalId,
        newEvent.id,
        notification,
      );
      return { success: true, message: 'Evento creado exitosamente.' };
    });
  }

  async edit(id: number, dto: EditEventDto) {
    return this.eventRepository.manager.transaction(async (manager) => {
      const coordinatorEvent = await manager.findOne(Person, {
        where: {
          document: dto.attendant,
        },
      });
      assertFound(coordinatorEvent, 'No se encontro el encargado especificado');
      await manager.update(EventEntity, id, {
        name: NormalizeString(dto.title),
        description: NormalizeString(dto.description),
        start_date: dto.startDate,
        estimated_end_date: dto.endDate,
        location: {
          id: dto.location,
        },
        street_address: NormalizeString(dto.streetAddress),
        person: {
          id: coordinatorEvent.id,
        },
      });
      await this.changeSkillQuota(manager, id, dto.skill_quota);
      return { success: true, message: 'El evento se edito correctamente.' };
    });
  }

  private async privateEvent(
    manager: EntityManager,
    id_event: number,
    participants: string[],
    start_date: Date,
    end_date: Date,
  ) {
    for (const participant of participants) {
      let enrollment = manager.create(EventEnrollment, {
        event: {
          id: id_event,
        },
        person: {
          id: participant,
        },
        skill: {
          id: 3,
        },
      });
      enrollment = await manager.save(enrollment);
      await manager.save(EventAttendance, {
        enrollment: {
          id: enrollment.id,
        },
        check_in: start_date,
        check_out: end_date,
        total_hours: this.calculateApproximateHours(
          start_date.toISOString(),
          end_date.toISOString(),
        ),
      });
    }
    await manager.update(Event, id_event, {
      end_date: end_date,
    });
  }

  private async assignStatus(
    manager: EntityManager,
    id_event: number,
    id_state: number,
  ) {
    let currentStatus =
      await this.eventStatusService.findOneOpenStateByIdPk(id_event);
    if (currentStatus) {
      await manager.update(EventStatus, currentStatus.id, {
        end_date: new Date(),
      });
    }
    currentStatus = manager.create(EventStatus, {
      event: {
        id: id_event,
      },
      state: {
        id: id_state,
      },
      start_date: new Date(),
    });
    await manager.save(EventStatus, currentStatus);
  }

  async getAllDto(id_user: string) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale('es');
    const rows: EventEntity[] = await this.eventRepository.find({
      relations: {
        location: {
          parent: true,
        },
        person: true,
        eventStatus: {
          state: true,
        },
        event_quotas: {
          skill: true,
        },
        event_enrollment: {
          person: true,
        },
      },
    });
    return rows.map((row) => {
      const dto = new GetEventCardDDto();
      dto.id = String(row.id);
      dto.title = FormatNamesString(row.name);
      dto.description = FormatNamesString(row.description);
      dto.startDate = dayjs(row.start_date)
        .tz('America/Bogota')
        .format('D MMMM YYYY, hh:mm A');
      dto.endDate = dayjs(row.estimated_end_date)
        .tz('America/Bogota')
        .format('D MMMM YYYY, hh:mm A');
      dto.capacity = String(row.max_volunteers);
      dto.streetAddress = row.street_address;
      dto.city = {
        id: String(row.location.id),
        name: FormatNamesString(row.location.name),
      };
      dto.department = {
        id: String(row.location.parent?.id),
        name: FormatNamesString(row.location.parent?.name ?? ''),
      };
      dto.leader = {
        id: row.person.document,
        name:
          FormatNamesString(row.person.name) +
          ' ' +
          FormatNamesString(row.person.last_name),
      };
      dto.state = FormatNamesString(
        row.eventStatus.find((e) => !e.end_date)?.state.name ?? '',
      );
      dto.startAt = row.estimated_end_date;
      dto.skill_quota = row.event_quotas.map((r) => {
        const skill_quota = new GetSkillQuota();
        skill_quota.id = String(r.skill.id);
        skill_quota.name = FormatNamesString(r.skill.name);
        skill_quota.quantity = String(r.quota - r.taken);
        return skill_quota;
      });
      dto.is_leader = id_user == row.person.id;
      dto.is_participant =
        Array.isArray(row.event_enrollment) &&
        row.event_enrollment.some(
          (ee) => ee.state && String(ee.person?.id) === String(id_user),
        );
      dto.is_adult = row.is_adult;
      return dto;
    });
  }

  async deactivate(id_event: number) {
    return this.eventRepository.manager.transaction(async (manager) => {
      const currentEvent = this.eventRepository.findOne({
        where: {
          id: id_event,
        },
      });
      assertFound(currentEvent, 'No se encontro el evento que deseas cancelar');
      await this.assignStatus(manager, id_event, 11);
      return { success: true, message: 'Evento cancelado exitosamente.' };
    });
  }

  private async assignSkillQuota(
    manager: EntityManager,
    id_event: number,
    skill_quotas: SkillQuota[],
  ) {
    for (const skillQuotaElement of skill_quotas) {
      await manager.save(
        EventQuota,
        manager.create(EventQuota, {
          skill: {
            id: skillQuotaElement.id,
          },
          event: {
            id: id_event,
          },
          quota: skillQuotaElement.qty,
        }),
      );
    }
  }

  private async changeSkillQuota(
    manager: EntityManager,
    id_event: number,
    skill_quotas: SkillQuota[],
  ) {
    const repo = manager.getRepository(EventQuota);

    const current = await repo.find({
      where: { event: { id: id_event } },
      relations: { skill: true },
    });

    const currentBySkillId = new Map<number, EventQuota>(
      current.map((eq) => [Number(eq.skill.id), eq]),
    );
    new Set<number>(skill_quotas.map((sq) => Number(sq.id)));
    for (const { id: skillId, qty } of skill_quotas) {
      const safeQty = Math.max(0, Number(qty) || 0);
      const existing = currentBySkillId.get(Number(skillId));

      if (existing) {
        if (existing.quota !== safeQty) {
          await repo.update(existing.id, { quota: safeQty });
        }
        currentBySkillId.delete(Number(skillId));
      } else {
        await repo.save(
          repo.create({
            event: { id: id_event },
            skill: { id: Number(skillId) },
            quota: safeQty,
          }),
        );
      }
    }

    if (currentBySkillId.size > 0) {
      const toZeroIds = Array.from(currentBySkillId.values()).map(
        (eq) => eq.id,
      );
      await repo
        .createQueryBuilder()
        .update(EventQuota)
        .set({ quota: 0 })
        .whereInIds(toZeroIds)
        .execute();
    }
  }

  private async sendNotification(
    manager: EntityManager,
    id_headquarters: number,
    id_event: number,
    id_notification: number,
  ) {
    const event = await manager.findOne(EventEntity, {
      where: {
        id: id_event,
      },
      relations: {
        location: {
          parent: true,
        },
        person: true,
        eventStatus: {
          state: true,
        },
        event_quotas: {
          skill: true,
        },
      },
    });
    assertFound(event, 'No se encontro el evento');
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale('es');
    const dto = new GetEventCardDDto();
    dto.id = String(event.id);
    dto.title = FormatNamesString(event.name);
    dto.description = FormatNamesString(event.description);
    dto.startDate = dayjs(event.start_date)
      .tz('America/Bogota')
      .format('D MMMM YYYY, hh:mm A');
    dto.endDate = dayjs(event.estimated_end_date)
      .tz('America/Bogota')
      .format('D MMMM YYYY, hh:mm A');
    dto.capacity = String(event.max_volunteers);
    dto.streetAddress = event.street_address;
    dto.city = {
      id: String(event.location.id),
      name: FormatNamesString(event.location.name),
    };
    dto.department = {
      id: String(event.location.parent?.id),
      name: FormatNamesString(event.location.parent?.name ?? ''),
    };
    dto.leader = {
      id: event.person.id,
      name:
        FormatNamesString(event.person.name) +
        ' ' +
        FormatNamesString(event.person.last_name),
    };
    dto.state = FormatNamesString(
      event.eventStatus.find((e) => !e.end_date)?.state.name ?? '',
    );
    dto.startAt = event.start_date;
    dto.skill_quota = event.event_quotas.map((r) => {
      const skill_quota = new GetSkillQuota();
      skill_quota.id = String(r.skill.id);
      skill_quota.name = FormatNamesString(r.skill.name);
      skill_quota.quantity = String(r.quota - r.taken);
      return skill_quota;
    });
    await this.personService.sendNotification(
      id_headquarters,
      dto,
      id_notification,
    );
  }

  async startEvent(id_event: number, userId: string) {
    return this.eventRepository.manager.transaction(async (manager) => {
      const currentEvent = await this.eventRepository.findOne({
        where: {
          id: id_event,
          person: {
            id: userId,
          },
        },
      });
      assertFound(
        currentEvent,
        'No puedes iniciar un evento que no este a tu cargo',
      );
      await this.assignStatus(manager, id_event, 9);
      const enrollmentCoordinator = await manager.findOne(EventEnrollment, {
        where: {
          person: {
            id: userId,
          },
          event: {
            id: id_event,
          },
          state: true,
        },
      });
      assertFound(
        enrollmentCoordinator,
        'No se encontro el registro del encargado',
      );
      await manager.save(
        EventAttendance,
        manager.create(EventAttendance, {
          enrollment: {
            id: enrollmentCoordinator.id,
          },
          check_in: new Date(),
        }),
      );
      return { success: true, message: 'Evento iniciado exitosamente.' };
    });
  }

  async endEvent(id_event: number) {
    return this.eventRepository.manager.transaction(async (manager) => {
      const currentEvent = this.eventRepository.findOne({
        where: {
          id: id_event,
        },
      });
      assertFound(currentEvent, 'No se encontro el vento que deseas cancelar');
      await this.assignStatus(manager, id_event, 10);
      return { success: true, message: 'Evento finalizado exitosamente.' };
    });
  }

  private calculateApproximateHours(start: string, end: string): number {
    const diffMin = dayjs(end).diff(dayjs(start), 'minute');
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;
    return minutes >= 40 ? hours + 1 : hours;
  }

  async requireIsAdult(id_event: number) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id_event,
      },
    });
    assertFound(event, 'No se encontro el evento especificado');
    return event.is_adult;
  }

  async eventIsProgrammed(id_event: number) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id_event,
      },
      relations: {
        eventStatus: {
          state: true,
        },
      },
    });
    assertFound(event, 'No se encontro el evento especificado');
    const currentState = event.eventStatus.find((e) => !e.end_date);
    assertFound(currentState, 'El evento no tiene un estado activo');
    return currentState.state.id === 8;
  }

  async CancellableEnrollment(id_event: number) {
    const event = await this.eventRepository.findOne({
      where: {
        id: id_event,
      },
    });
    assertFound(event, 'No se encontro el evento especificado');
    return dayjs(event.start_date).diff(dayjs(), 'hour', true) > 8;
  }

  private async enrollmentCoordinatorEvent(
    manager: EntityManager,
    id_event: number,
    id_person: string,
  ) {
    await manager.query(
      `
      UPDATE public.event_quota
         SET taken = taken + 1
       WHERE id_event = $1
         AND id_skill = $2
         AND taken < quota
      RETURNING id;
      `,
      [id_event, 3],
    );
    await manager.save(
      manager.create(EventEnrollment, {
        event: {
          id: id_event,
        },
        person: {
          id: id_person,
        },
        skill: {
          id: 3,
        },
        state: true,
      }),
    );
  }

  async getEventCalendar() {
    const events = await this.eventRepository.find();
    return events.map((event) => {
      const dto = new GetEventCalendarDto();
      dto.id = String(event.id);
      dto.title = event.name;
      dto.start = event.start_date;
      dto.end = event.estimated_end_date;
      dto.color = '#2563eb';
      dto.textColor = '#ffffff';
      return dto;
    });
  }
}
