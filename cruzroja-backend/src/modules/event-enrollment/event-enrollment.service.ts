import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEnrollment } from './entity/event-enrollment.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateEventEnrollmentDto } from './dto/create-event-enrollment.dto';
import { CanceledEventEnrollmentDto } from './dto/canceled-event-enrollment.dto';
import { GetParticipantDto } from './dto/get-participant.dto';
import { FormatNamesString } from '../../common/utils/string.utils';
import { PersonService } from '../person/person.service';
import { EventService } from '../event/event.service';
import { conflict } from '../../common/utils/assert';

@Injectable()
export class EventEnrollmentService {
  constructor(
    @InjectRepository(EventEnrollment)
    private enrollmentRepository: Repository<EventEnrollment>,
    private personService: PersonService,
    private eventService: EventService,
  ) {}

  async enrollment(dto: CreateEventEnrollmentDto) {
    return this.enrollmentRepository.manager.transaction(async (manager) => {
      const { id_event, id_person, id_skill } = dto;
      const id_adult = await this.personService.is_adult(id_person);
      if ((await this.eventService.requireIsAdult(id_event)) && !id_adult) {
        conflict(
          'No te puedes inscribir al evento xq exige que seas mayor de edad',
        );
      }

      if (await this.hasTimeOverlap(manager, dto.id_person, dto.id_event)) {
        return {
          success: false,
          message: 'Ya estás inscrito en otro evento que se cruza en horario.',
        };
      }

      const current = await manager
        .getRepository(EventEnrollment)
        .createQueryBuilder('ee')
        .setLock('pessimistic_write')
        .where('ee.event = :eventId AND ee.person = :personId', {
          eventId: id_event,
          personId: id_person,
        })
        .innerJoinAndSelect('ee.skill', 'skill')
        .getOne();

      if (current?.state === true) {
        return { success: true, message: 'Ya estás inscrito en este evento.' };
      }

      const took: { id: number }[] = await manager.query(
        `
      UPDATE public.event_quota
         SET taken = taken + 1
       WHERE id_event = $1
         AND id_skill = $2
         AND taken < quota
      RETURNING id;
      `,
        [id_event, id_skill],
      );

      if (took.length === 0) {
        return {
          success: false,
          message: 'No hay cupos disponibles para la habilidad seleccionada.',
        };
      }

      if (current) {
        await manager.update(
          EventEnrollment,
          { id: current.id },
          {
            state: true,
            skill: { id: id_skill },
            updated_at: () => 'now()',
          },
        );
      } else {
        const enrollment = manager.create(EventEnrollment, {
          event: { id: id_event },
          person: { id: id_person },
          skill: { id: id_skill },
          state: true,
        });
        await manager.save(enrollment);
      }

      return { success: true, message: 'Inscripción realizada con éxito.' };
    });
  }

  async findEnrollmentInEvent(id_person: string, id_event: number) {
    return this.enrollmentRepository.findOne({
      where: {
        person: {
          id: id_person,
        },
        event: {
          id: id_event,
        },
        state: true,
      },
    });
  }

  async hasTimeOverlap(
    manager: EntityManager,
    personId: string,
    eventId: number,
  ): Promise<boolean> {
    const rows: { id: number }[] = await manager.query(
      `
    SELECT 1
    FROM public.event_enrollment ee
    JOIN public.event e1 ON e1.id = ee.id_event
    JOIN public.event e2 ON e2.id = $2
    WHERE ee.id_person = $1
      AND ee.state = true
      AND ee.id_event <> $2
      AND e1.start_date < COALESCE(e2.end_date, e2.estimated_end_date)
      AND COALESCE(e1.end_date, e1.estimated_end_date) > e2.start_date
    LIMIT 1;
    `,
      [personId, eventId],
    );
    return rows.length > 0;
  }

  async canceledEnrollment(dto: CanceledEventEnrollmentDto) {
    return await this.enrollmentRepository.manager.transaction(
      async (manager) => {
        if (!(await this.eventService.CancellableEnrollment(dto.id_event))) {
          conflict(
            'Ya no puedes cancelar la incripcion por que el evento inicia en menos de 8 horas, contacta al lider de tu sede',
          );
        }
        if (!(await this.eventService.eventIsProgrammed(dto.id_event))) {
          conflict(
            'Ya no puedes cancelar tu inscripcion xq el evento ya cambio de estado',
          );
        }
        const enrollment = await manager
          .getRepository(EventEnrollment)
          .createQueryBuilder('ee')
          .leftJoinAndSelect('ee.skill', 'skill')
          .where(
            'ee.id_event = :id_event AND ee.id_person = :id_person AND ee.state = true',
            {
              id_event: dto.id_event,
              id_person: dto.id_person,
            },
          )
          .getOne();

        if (!enrollment) {
          return {
            success: false,
            message: 'No se encontró una inscripción activa para cancelar.',
          };
        }

        await manager.update(EventEnrollment, enrollment.id, {
          state: false,
          updated_at: new Date(),
        });

        await manager.query(
          `
        UPDATE public.event_quota
           SET taken = GREATEST(taken - 1, 0)
         WHERE id_event = $1
           AND id_skill = $2;
        `,
          [dto.id_event, enrollment.skill.id],
        );

        return {
          success: true,
          message: 'Inscripción cancelada con éxito.',
        };
      },
    );
  }

  async getParticipants(id_event: number) {
    const enrollments: EventEnrollment[] = await this.enrollmentRepository.find(
      {
        where: {
          event: {
            id: id_event,
          },
          state: true,
        },
        relations: {
          person: true,
        },
      },
    );
    return enrollments.map((enrollment) => {
      const person = new GetParticipantDto();
      person.name =
        FormatNamesString(enrollment.person.name) +
        ' ' +
        FormatNamesString(enrollment.person.last_name);
      person.licence = enrollment.person.license ?? '';
      person.phone = String(enrollment.person.phone);
      return person;
    });
  }
}
