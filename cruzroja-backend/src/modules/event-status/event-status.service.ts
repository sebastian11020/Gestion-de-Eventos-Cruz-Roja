import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventStatus } from './entity/event-status.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class EventStatusService {
  constructor(
    @InjectRepository(EventStatus)
    private eventStatusRepository: Repository<EventStatus>,
  ) {}

  async findOneOpenStateByIdPk(id: number): Promise<EventStatus | null> {
    return this.eventStatusRepository.findOne({
      where: {
        event: {
          id: id,
        },
        end_date: IsNull(),
      },
      relations: {
        state: true,
        event: true,
      },
    });
  }
}
