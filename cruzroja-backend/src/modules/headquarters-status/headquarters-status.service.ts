import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HeadquartersStatus } from './entity/headquarters-status.entity';

@Injectable()
export class HeadquartersStatusService {
  constructor(
    @InjectRepository(HeadquartersStatus)
    private headaquartersStatusService: Repository<HeadquartersStatus>,
  ) {}

  async findOneOpenState(
    id_headquarters: number,
  ): Promise<HeadquartersStatus | null> {
    return await this.headaquartersStatusService.findOne({
      where: {
        headquarters: {
          id: id_headquarters,
        },
        end_date: IsNull(),
      },
      relations: {
        state: true,
      },
    });
  }
}
