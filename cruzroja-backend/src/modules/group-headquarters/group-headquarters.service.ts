import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { CreateGroupHeadquarters } from './dto/create-group-headquarters.dto';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import { GetGroupHeadquartersDto } from './dto/get-group-headquarters.dto';
import { FormatNamesString } from '../../common/utils/string.utils';
import { GroupStatus } from '../group-status/entity/group-status.entity';
import { PersonRole } from '../person-role/entity/person-role.entity';
import { HeadquartersStatusService } from '../headquarters-status/headquarters-status.service';
import { GroupStatusService } from '../group-status/group-status.service';

@Injectable()
export class GroupHeadquartersService {
  constructor(
    @InjectRepository(GroupHeadquarters)
    private groupHeadquartersRepository: Repository<GroupHeadquarters>,
    private headquartersStatusService: HeadquartersStatusService,
    private groupHeadquartersStatusService: GroupStatusService,
  ) {}

  async getAllGroupHeadquartersDto() {
    const rows: {
      id: number;
      name: string;
      sectional: {
        id: number;
        name: string;
      };
      number_volunteers: number;
      number_programs: number;
      leader: {
        document: string;
        name: string;
      };
    }[] = await this.groupHeadquartersRepository.query(
      'select * from public.list_groups_with_details()',
    );
    return rows.map((row) => {
      const dto = new GetGroupHeadquartersDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      dto.sectional = {
        id: String(row.sectional.id),
        name: FormatNamesString(row.sectional.name),
      };
      dto.numberVolunteers = String(row.number_volunteers);
      dto.numberPrograms = String(row.number_programs);
      dto.leader = {
        document: row.leader.document,
        name: FormatNamesString(row.leader.name),
      };
      return dto;
    });
  }

  private async checkStatusHeadquarters(id_headquarters: number) {
    const headquarters_status =
      await this.headquartersStatusService.findOneOpenState(id_headquarters);
    assertFound(headquarters_status, 'No se encontro la sede especificada');
    return headquarters_status.state.name === 'ACTIVO';
  }

  async createOrActivate(dto: CreateGroupHeadquarters) {
    return this.groupHeadquartersRepository.manager.transaction(
      async (manager) => {
        let message = '';
        if (!(await this.checkStatusHeadquarters(dto.idHeadquarters))) {
          conflict('No se puede activar una agrupacion en una sede inactiva');
        }

        let group_headquarters = await this.findOneById(
          dto.idHeadquarters,
          dto.idGroup,
        );
        if (group_headquarters) {
          if (await this.checkGroupHeadquarters(group_headquarters.id)) {
            conflict(
              `La sede de ${group_headquarters.headquarters.location.name} ya tiene la agrupacion ${group_headquarters.group.name} activa`,
            );
          } else {
            await this.changeGroupStatus(manager, group_headquarters.id);
            message = 'Se reactivo la agrupacion correctamente';
          }
        } else {
          group_headquarters = manager.create(GroupHeadquarters, {
            group: {
              id: dto.idGroup,
            },
            headquarters: {
              id: dto.idHeadquarters,
            },
          });
          group_headquarters = await manager.save(group_headquarters);
          await this.changeGroupStatus(manager, group_headquarters.id);
          message = 'Se creo la agrupacion correctamente';
        }
        await this.assignCoordinator(
          manager,
          dto.leader,
          dto.idHeadquarters,
          group_headquarters.id,
        );
        return { success: true, message };
      },
    );
  }

  /*
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
   */

  private async checkGroupHeadquarters(id: number) {
    const row: GroupStatus | null =
      await this.groupHeadquartersStatusService.findOneOpenStateByIdPk(id);
    return row && row.state.name === 'ACTIVO';
  }

  private async changeGroupStatus(manager: EntityManager, id: number) {
    const currentStatus =
      await this.groupHeadquartersStatusService.findOneOpenStateByIdPk(id);
    let aux_id_state: number = 1;
    if (currentStatus) {
      await manager.update(GroupStatus, id, {
        end_date: new Date(),
      });
      if (currentStatus.state.name === 'ACTIVO') {
        aux_id_state = 2;
      }
    }
    const newState: GroupStatus = manager.create(GroupStatus, {
      state: {
        id: aux_id_state,
      },
      groupHeadquarters: {
        id: id,
      },
    });
    await manager.save(newState);
  }

  private async assignCoordinator(
    manager: EntityManager,
    document: string,
    id_headquarters: number,
    id_group_headquarters: number,
  ) {
    assert(document, 'El documento del coordinador es obligatorio');
    const personRol = await manager.findOne(PersonRole, {
      where: {
        person: {
          document: document,
        },
        end_date: IsNull(),
      },
      relations: {
        person: true,
      },
    });
    assertFound(
      personRol,
      `No se encontro una persona asociada al siguiente documento: ${document}`,
    );
    personRol.end_date = new Date();
    await manager.update(PersonRole, personRol.id, {
      end_date: new Date(),
    });
    await manager.save(
      manager.create(PersonRole, {
        person: {
          id: personRol.person.id,
        },
        role: {
          id: 3,
        },
        headquarters: {
          id: id_headquarters,
        },
        group: {
          id: id_group_headquarters,
        },
      }),
    );
  }

  private async closeCoordinatorRoleCurrent(
    manager: EntityManager,
    id_headquarters: number,
    id_group_headquarters: number,
  ) {
    const coordCurrent = await manager.findOne(PersonRole, {
      where: {
        end_date: IsNull(),
        role: {
          id: 3,
        },
        headquarters: {
          id: id_headquarters,
        },
        group: {
          id: id_group_headquarters,
        },
      },
      relations: {
        person: true,
      },
    });
    if (coordCurrent) {
      await manager.update(PersonRole, id_group_headquarters, {
        end_date: new Date(),
      });
      await manager.insert(PersonRole, {
        person: {
          id: coordCurrent.person.id,
        },
        role: {
          id: 5,
        },
        headquarters: {
          id: id_headquarters,
        },
        group: {
          id: id_group_headquarters,
        },
      });
    }
  }

  async findOneById(id_headquarters: number, id_group: number) {
    return this.groupHeadquartersRepository.findOne({
      where: {
        headquarters: {
          id: id_headquarters,
        },
        group: {
          id: id_group,
        },
      },
    });
  }
}
