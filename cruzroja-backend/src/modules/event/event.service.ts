import { Injectable } from '@nestjs/common';
import { Event as EventEntity } from './entity/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventForm } from './dto/create-event.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GroupHeadquartersService } from '../group-headquarters/group-headquarters.service';
import { GetEventCardDDto } from './dto/get-event.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';
import { Repository } from 'typeorm';
import { PersonService } from '../person/person.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private groupHeadquartersService: GroupHeadquartersService,
    private personService: PersonService,
  ) {}

  async create(eventForm: CreateEventForm) {
    return this.eventRepository.manager.transaction(async (manager) => {
      const idGroupHeadquarters =
        await this.groupHeadquartersService.findOneById(
          eventForm.sectionalId,
          eventForm.groupId,
        );
      const coordinatorEvent = await this.personService.findByIdDto(
        eventForm.attendant.document,
      );
      const newEvent = manager.create(EventEntity, {
        name: NormalizeString(eventForm.name),
        description: NormalizeString(eventForm.description),
        start_date: eventForm.startDate,
        estimated_end_date: eventForm.endDate,
        is_virtual: eventForm.isVirtual,
        decree_1809_applies: eventForm.applyDecreet,
        is_private: eventForm.isPrivate,
        is_adult: eventForm.isAdult,
        max_volunteers: eventForm.capacity,
        street_address: eventForm.streetAddress,
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
          id: coordinatorEvent.leader?.id,
        },
        headquarters: {
          id: eventForm.sectionalId,
        },
        groupHeadquarters: {
          id: idGroupHeadquarters?.id ?? undefined,
        },
      });
      await manager.save(EventEntity, newEvent);
      return { success: true, message: 'Evento creado exitosamente.' };
    });
  }

  async getAllDto() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale('es');
    const rows: EventEntity[] = await this.eventRepository.find({
      relations: {
        location: true,
        person: true,
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
      dto.location = FormatNamesString(row.location.name);
      dto.leader = {
        id: row.person.id,
        name: FormatNamesString(row.person.name),
      };
      dto.startAt = row.start_date;
      return dto;
    });
  }
}
