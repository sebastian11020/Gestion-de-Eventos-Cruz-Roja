import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from './entity/groups.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { assertFound, conflict } from '../../common/utils/assert';
import { UpdateGroupDto } from './dto/update-group';
import { GetGroupDto } from './dto/get-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Groups) private groupRepository: Repository<Groups>,
  ) {}

  async getAllDto() {
    const rows: {
      id: number;
      name: string;
      sectional: string;
      number_volunteers: number;
      number_programs: number;
      leader: {
        document: string;
        name: string;
      };
      programs: {
        id: string;
        name: string;
      };
    }[] = await this.groupRepository.query(
      'select * from public.list_groups_with_details($1)',
      ['ACTIVO'],
    );
    return rows.map((row) => {
      const dto = new GetGroupDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      dto.sectional = FormatNamesString(row.sectional);
      dto.numberVolunteers = String(row.number_volunteers);
      dto.numberPrograms = String(row.number_programs);
      dto.leader = row.leader;
      dto.programs = row.programs;
      return dto;
    });
  }

  async getById(id: number) {
    return await this.groupRepository.findOne({
      where: { id },
    });
  }

  async create(dto: CreateGroupDto) {
    let group: Groups | null = await this.groupRepository.findOne({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (group) {
      conflict(`ya existe una agrupacion con el nombre ${dto.name}`);
    } else {
      group = this.groupRepository.create({
        name: NormalizeString(dto.name),
      });
    }
    await this.groupRepository.save(group);
    return { success: true };
  }

  async update(id: number, dto: UpdateGroupDto) {
    const group: Groups | null = await this.groupRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(group, `No se encontro agrupacion con el id ${id}`);
    if (
      await this.groupRepository.findOne({
        where: {
          name: NormalizeString(dto.name),
        },
      })
    ) {
      conflict(
        `Ya existe una agrupacion con el nombre ${FormatNamesString(dto.name)}`,
      );
    }
    group.name = NormalizeString(dto.name);
    await this.groupRepository.update(dto.id_group, group);
    return { success: true };
  }
}
