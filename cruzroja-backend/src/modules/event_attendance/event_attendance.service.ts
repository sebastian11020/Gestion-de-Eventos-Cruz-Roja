import { Injectable } from '@nestjs/common';
import { EventAttendance } from './entity/event_attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEnrollmentService } from '../event-enrollment/event-enrollment.service';
import { assertFound } from '../../common/utils/assert';
import { CheckInOutDto } from './dto/check-in-out.dto';
import { ActionEnum } from './enum/action.enum';
import dayjs from 'dayjs';

@Injectable()
export class EventAttendanceService {
  constructor(
    @InjectRepository(EventAttendance)
    private eventAttendanceRepository: Repository<EventAttendance>,
    private eventEnrollmentService: EventEnrollmentService,
  ) {}

  async checkInAndCheckOut(id_user: string, dto: CheckInOutDto) {
    let message: string = '';
    const enrollment = await this.eventEnrollmentService.findEnrollmentInEvent(
      id_user,
      dto.id_event,
    );
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
    }
    return { success: true, message: message };
  }

  private calculateApproximateHours(start: string, end: string): number {
    const diffMin = dayjs(end).diff(dayjs(start), 'minute');
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;
    return minutes >= 40 ? hours + 1 : hours;
  }
}
