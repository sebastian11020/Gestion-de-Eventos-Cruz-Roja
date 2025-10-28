import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entity/skill.entity';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { conflict } from '../../common/utils/assert';
import { GetRoleDto } from '../role/dto/get-role.dto';
import { GetSkillDto } from './dto/get-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}

  async create(dto: CreateSkillDto) {
    let skill = await this.skillRepository.findOne({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (skill) {
      conflict(`Ya existe el rol ${dto.name}`);
    } else {
      skill = this.skillRepository.create({
        name: NormalizeString(dto.name),
      });
    }
    await this.skillRepository.save(skill);
    return {
      success: true,
      message: `La habilidad ${skill.name} se creo exitosamente`,
    };
  }

  async getAllDto(): Promise<GetSkillDto[]> {
    const rows = await this.skillRepository.find();
    return rows.map((row) => {
      const role = new GetRoleDto();
      role.name = FormatNamesString(row.name);
      role.id = String(row.id);
      return role;
    });
  }

  async update(id: number, dto: CreateSkillDto) {
    await this.skillRepository.update(id, {
      name: NormalizeString(dto.name),
    });
    return { success: true, message: 'Habilidad actualizada exitosamente' };
  }
}
