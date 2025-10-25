import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventQuota } from './entity/event-quota.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventQuotaService {
  constructor(
    @InjectRepository(EventQuota)
    private eventQuotaRepository: Repository<EventQuota>,
  ) {}

  async findQuotaOfSkillInEvent(
    id_event: number,
    id_skill: number,
  ): Promise<EventQuota | null> {
    return this.eventQuotaRepository.findOne({
      where: {
        event: {
          id: id_event,
        },
        skill: {
          id: id_skill,
        },
      },
      relations: {
        skill: true,
      },
    });
  }
}
