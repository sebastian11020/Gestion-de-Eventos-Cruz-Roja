import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramStatus } from './entity/program-status.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProgramStatusService {
  constructor(
    @InjectRepository(ProgramStatus)
    private programStatusRepository: Repository<ProgramStatus>,
  ) {}

  async findOneOpenStateByIdPk(id: number): Promise<ProgramStatus | null> {
    return this.programStatusRepository.findOne({
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
    id_program: number,
  ): Promise<ProgramStatus | null> {
    return await this.programStatusRepository.findOne({
      where: {
        programHeadquarters: {
          program: {
            id: id_program,
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
