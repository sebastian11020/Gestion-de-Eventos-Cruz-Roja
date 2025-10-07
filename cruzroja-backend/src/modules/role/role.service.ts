import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { conflict } from '../../common/utils/assert';
import { GetRoleDto } from './dto/get-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    let role = await this.roleRepository.findOne({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (role) {
      conflict(`Ya existe el rol ${dto.name}`);
    } else {
      role = this.roleRepository.create({
        name: NormalizeString(dto.name),
      });
    }
    await this.roleRepository.save(role);
    return {
      success: true,
      message: `El rol ${role.name} se creo exitosamente`,
    };
  }

  async getAllDto(): Promise<GetRoleDto[]> {
    const rows = await this.roleRepository.find();
    return rows.map((row) => {
      const role = new GetRoleDto();
      role.name = FormatNamesString(row.name);
      role.id = String(row.id);
      return role;
    });
  }

  async update(id: number, dto: CreateRoleDto) {
    await this.roleRepository.update(id, {
      name: NormalizeString(dto.name),
    });
    return { success: true, message: 'Rol actualizado exitosamente' };
  }
}
