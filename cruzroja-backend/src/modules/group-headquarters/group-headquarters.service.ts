import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { Repository } from 'typeorm';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';
import { assertFound, conflict } from '../../common/utils/assert';
import { HeadquartersService } from '../headquarters/headquarters.service';

@Injectable()
export class GroupHeadquartersService {
  constructor(
    @InjectRepository(GroupHeadquarters)
    private groupHeadquartersRepository: Repository<GroupHeadquarters>,
    private headquartersService: HeadquartersService,
  ) {}

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

  async deactivate(dto: CreateGroupHeadquarters) {
    const object = await this.groupHeadquartersRepository.findOne({
      where: {
        idGroup: dto.idGroup,
        idHeadquarters: dto.idHeadquarters,
      },
    });
    assertFound(object, `No se encontro la agrupacion que deseas desactivar`);
    object.state = false;
    await this.groupHeadquartersRepository.save(object);
    return { success: true };
  }
}
