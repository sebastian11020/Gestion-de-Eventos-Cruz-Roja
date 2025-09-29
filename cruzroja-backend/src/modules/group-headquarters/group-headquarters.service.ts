import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { Repository } from 'typeorm';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';
import { assertFound, conflict } from '../../common/utils/assert';
import { HeadquartersService } from '../headquarters/headquarters.service';
import { GetGroupHeadquartersDto } from './dto/get-group-headquarters.dto';
import { FormatNamesString } from '../../common/utils/string.utils';

@Injectable()
export class GroupHeadquartersService {
  constructor(
    @InjectRepository(GroupHeadquarters)
    private groupHeadquartersRepository: Repository<GroupHeadquarters>,
    private headquartersService: HeadquartersService,
  ) {}

  async getAllGroupHeadquartersDto() {
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
    }[] = await this.groupHeadquartersRepository.query(
      'select * from public.list_groups_with_details($1)',
      ['ACTIVO'],
    );
    return rows.map((row) => {
      const dto = new GetGroupHeadquartersDto();
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

  private async checkStatusHeadquarters(id: number) {
    const headquarters = await this.headquartersService.getById(id);
    return headquarters.state;
  }

  async createOrActivate(dto: CreateGroupHeadquarters) {
    if (!(await this.checkStatusHeadquarters(dto.idHeadquarters))) {
      conflict('No se puede activar una agrupacion en una sede incativa');
    }
    let object = await this.groupHeadquartersRepository.findOne({
      where: {
        idGroup: dto.idGroup,
        idHeadquarters: dto.idHeadquarters,
      },
    });
    if (!object) {
      object = this.groupHeadquartersRepository.create({
        idGroup: dto.idGroup,
        idHeadquarters: dto.idHeadquarters,
        state: true,
      });
    } else {
      if (!object.state) {
        object.state = true;
      } else {
        conflict(
          `La sede de ${object.headquarters.location.name} ya tiene la agrupacion ${object.group.name} activa`,
        );
      }
    }
    await this.groupHeadquartersRepository.save(object);
    return { success: true };
  }

  async deactivate(idGroup: number, idHeadquarters: number) {
    const object = await this.groupHeadquartersRepository.findOne({
      where: {
        idGroup: idGroup,
        idHeadquarters: idHeadquarters,
      },
    });
    assertFound(object, `No se encontro la agrupacion que deseas desactivar`);
    object.state = false;
    await this.groupHeadquartersRepository.save(object);
    return { success: true };
  }
}
