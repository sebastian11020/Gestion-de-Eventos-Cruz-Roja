import { Injectable } from '@nestjs/common';
import { EventAttendance } from './entity/event_attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { EventEnrollmentService } from '../event-enrollment/event-enrollment.service';
import { assertFound } from '../../common/utils/assert';
import { CheckInOutDto } from './dto/check-in-out.dto';
import { ActionEnum } from './enum/action.enum';
import dayjs from 'dayjs';
import { Event } from '../event/entity/event.entity';

@Injectable()
export class EventAttendanceService {
  constructor(
    @InjectRepository(EventAttendance)
    private eventAttendanceRepository: Repository<EventAttendance>,
    private eventEnrollmentService: EventEnrollmentService,
  ) {}

  async checkInAndCheckOut(dto: CheckInOutDto) {
    let message: string = '';
    console.log(dto);
    const enrollment = await this.eventEnrollmentService.findEnrollmentInEvent(
      dto.user_id,
      dto.id_event,
    );
    console.log(dto);
    assertFound(enrollment, 'No te encuentras inscrito en este evento');
    let attendance: EventAttendance | null;
    if (dto.action === ActionEnum.start) {
      attendance = this.eventAttendanceRepository.create({
        enrollment: {
          id: enrollment.id,
        },
        check_in: new Date(),
      });
      await this.eventAttendanceRepository.save(attendance);
      message = 'Registro de ingreso exitoso';
    } else {
      attendance = await this.eventAttendanceRepository.findOne({
        where: {
          enrollment: {
            id: enrollment.id,
          },
        },
      });
      assertFound(
        attendance,
        'No se pudo registrar la salida del evento, debido a que no se encontro registro de ingreso',
      );
      const checkOut = new Date();
      const hours = this.calculateApproximateHours(
        attendance.check_in.toISOString(),
        checkOut.toISOString(),
      );
      await this.eventAttendanceRepository.update(attendance.id, {
        check_out: checkOut,
        total_hours: hours,
      });
      message = `Registro de salida exitoso, se te sumaron ${hours} horas.`;
      await this.maybeCheckoutCoordinatorAt50(enrollment.event);
    }
    return { success: true, message: message };
  }

  private async maybeCheckoutCoordinatorAt50(event: Event): Promise<void> {
    if (!event) return;

    const coordinatorId = event.person.id;

    const checkedIn = await this.eventAttendanceRepository.count({
      where: {
        enrollment: {
          event: { id: event.id },
          state: true,
          person: { id: Not(coordinatorId) },
        },
        check_in: Not(IsNull()),
      },
    });

    if (checkedIn === 0) return;

    const checkedOut = await this.eventAttendanceRepository.count({
      where: {
        enrollment: {
          event: { id: event.id },
          state: true,
          person: { id: Not(coordinatorId) },
        },
        check_out: Not(IsNull()),
      },
    });

    const halfExited = checkedOut > checkedIn / 2;
    if (!halfExited) return;

    const coordinatorOpen = await this.eventAttendanceRepository.findOne({
      where: {
        enrollment: {
          event: { id: event.id },
          person: { id: coordinatorId },
          state: true,
        },
        check_out: IsNull(),
      },
      relations: { enrollment: true },
    });

    if (!coordinatorOpen) return;

    const now = new Date();
    const hours = this.calculateApproximateHours(
      coordinatorOpen.check_in.toISOString(),
      now.toISOString(),
    );

    await this.eventAttendanceRepository.update(coordinatorOpen.id, {
      check_out: now,
      total_hours: hours,
    });
  }

  private calculateApproximateHours(start: string, end: string): number {
    const diffMin = dayjs(end).diff(dayjs(start), 'minute');
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;
    return minutes >= 40 ? hours + 1 : hours;
  }
}
