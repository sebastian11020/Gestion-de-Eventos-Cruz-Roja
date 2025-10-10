import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupStatus } from './entity/group-status.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class GroupStatusService {
  constructor(
    @InjectRepository(GroupStatus)
    private groupStatusRepository: Repository<GroupStatus>,
  ) {}

  async findOneOpenStateByIdPk(id: number): Promise<GroupStatus | null> {
    return this.groupStatusRepository.findOne({
      where: {
        id: id,
        end_date: IsNull(),
      },
      relations: {
        state: true,
      },
    });
  }

  async findOneOpenStateByIdsFk(
    id_headquarters: number,
    id_group: number,
  ): Promise<GroupStatus | null> {
    return await this.groupStatusRepository.findOne({
      where: {
        groupHeadquarters: {
          group: {
            id: id_group,
          },
          headquarters: {
            id: id_headquarters,
          },
        },
        end_date: IsNull(),
      },
      relations: {
        state: true,
      },
    });
  }
}
