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

  async getAllGroupDto(): Promise<GetGroupDto[]> {
    const rows = await this.groupRepository.find();
    return rows.map((row) => {
      const dto = new GetGroupDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      return dto;
    });
  }

  async getById(id: number) {
    return await this.groupRepository.findOne({
      where: { id },
    });
  }

  async create(dto: CreateGroupDto) {
    console.log(dto);
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
    await this.groupRepository.update(id, {
      name: NormalizeString(dto.name),
    });
    return { success: true };
  }
}
