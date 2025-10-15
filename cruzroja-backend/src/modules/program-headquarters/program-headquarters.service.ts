import { Injectable } from '@nestjs/common';
import { FormatNamesString } from '../../common/utils/string.utils';
import { assertFound, conflict } from '../../common/utils/assert';
import { ProgramHeadquarters } from './entity/program-headquarters.entity';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AssociateProgramHeadquarters } from './dto/associate-program-headquarters';
import { GetProgramHeadquartersDto } from './dto/get-program-headquarters';
import { HeadquartersStatusService } from '../headquarters-status/headquarters-status.service';
import { GroupStatusService } from '../group-status/group-status.service';
import { GroupStatus } from '../group-status/entity/group-status.entity';
import { ProgramStatus } from '../program-status/entity/program-status.entity';
import { ProgramStatusService } from '../program-status/program-status.service';
import { PersonRole } from '../person-role/entity/person-role.entity';
import { ChangeCoordinatorProgramsDto } from './dto/change-coordinator-program-headquarters.dto';

@Injectable()
export class ProgramHeadquartersService {
  constructor(
    @InjectRepository(ProgramHeadquarters)
    private programHeadquartersRepository: Repository<ProgramHeadquarters>,
    private headquartersStatusService: HeadquartersStatusService,
    private groupHeadquartersStatusService: GroupStatusService,
    private programHeadquartersStatusService: ProgramStatusService,
  ) {}

  async getAllProgramHeadquartersDto() {
    const rows: {
      id: number;
      id_program: number;
      name: string;
      sectional: {
        id: number;
        name: string;
      };
      group: string;
      number_volunteers: number;
      leader: {
        document: string;
        name: string;
      };
    }[] = await this.programHeadquartersRepository.query(
      'select * from public.list_active_programs_with_details()',
    );
    return rows.map((row) => {
      const dto = new GetProgramHeadquartersDto();
      dto.id = String(row.id);
      dto.id_program = String(row.id_program);
      dto.name = FormatNamesString(row.name);
      dto.sectional = {
        id: String(row.sectional.id),
        name: FormatNamesString(row.sectional.name),
      };
      dto.group = FormatNamesString(row.group);
      dto.numberVolunteers = String(row.number_volunteers);
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

  async createOrActivate(dto: AssociateProgramHeadquarters) {
    return this.programHeadquartersRepository.manager.transaction(
      async (manager) => {
        let message = '';
        if (!(await this.checkStatusHeadquarters(dto.idHeadquarters))) {
          conflict('No se puede activar una agrupacion en una sede inactiva');
        }
        const group_headquarters = await this.checkGroupHeadquarters(
          dto.idHeadquarters,
          dto.id_group,
        );
        if (!(group_headquarters.state.name === 'ACTIVO')) {
          conflict(
            'No se puede activar un programa de una agrupacion inactiva',
          );
        }

        let program_headquarters = await this.findOneById(
          dto.idHeadquarters,
          dto.idProgram,
        );

        if (program_headquarters) {
          if (await this.checkProgramHeadquarters(program_headquarters.id)) {
            conflict(
              `La sede de ${program_headquarters.headquarters.location.name} ya tiene el programa ${program_headquarters.program.name} activo`,
            );
          } else {
            await this.changeProgramStatus(manager, program_headquarters.id);
            message = 'Se reactivo el programa correctamente';
          }
        } else {
          program_headquarters = manager.create(ProgramHeadquarters, {
            headquarters: {
              id: dto.idHeadquarters,
            },
            program: {
              id: dto.idProgram,
            },
          });
          program_headquarters = await manager.save(program_headquarters);
          await this.changeProgramStatus(manager, program_headquarters.id);
          message = 'Se creo el programa correctamente';
        }
        await this.assignCoordinator(
          manager,
          dto.leader,
          dto.idHeadquarters,
          group_headquarters.groupHeadquarters.id,
          program_headquarters.id,
        );
        return { success: true, message };
      },
    );
  }

  private async checkGroupHeadquarters(
    id_headquarters: number,
    id_group: number,
  ) {
    const group_status: GroupStatus | null =
      await this.groupHeadquartersStatusService.findOneOpenStateByIdsFk(
        id_headquarters,
        id_group,
      );
    assertFound(group_status, 'No se encontro la agrupacion especificada');
    return group_status;
  }

  private async checkProgramHeadquarters(id: number) {
    const row: ProgramStatus | null =
      await this.programHeadquartersStatusService.findOneOpenStateByIdPk(id);
    return row && row.state.name === 'ACTIVO';
  }

  private async changeProgramStatus(manager: EntityManager, id: number) {
    const program = await manager.findOne(ProgramHeadquarters, {
      where: {
        id: id,
      },
      relations: {
        programStatus: true,
      },
    });
    assertFound(program, 'No se encontro el programa que deseas desactivar');

    const activeStatus = program.programStatus?.find(
      (ps) => ps.end_date == null,
    );
    let aux_id_state: number = 1;
    if (activeStatus) {
      const currentStatus =
        await this.programHeadquartersStatusService.findOneOpenStateByIdPk(
          activeStatus.id,
        );
      if (currentStatus) {
        await manager.update(ProgramStatus, activeStatus.id, {
          end_date: new Date(),
        });
        if (currentStatus.state.name === 'ACTIVO') {
          aux_id_state = 2;
        }
      }
    }
    const newState: ProgramStatus = manager.create(ProgramStatus, {
      state: {
        id: aux_id_state,
      },
      programHeadquarters: {
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
    id_program_headquarters: number,
  ) {
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
    await manager.update(PersonRole, personRol.id, {
      end_date: new Date(),
    });
    await manager.save(
      manager.create(PersonRole, {
        person: {
          id: personRol.person.id,
        },
        role: {
          id: 4,
        },
        headquarters: {
          id: id_headquarters,
        },
        group: {
          id: id_group_headquarters,
        },
        program: {
          id: id_program_headquarters,
        },
      }),
    );
  }

  async deactivate(id: number) {
    return await this.programHeadquartersRepository.manager.transaction(
      async (manager) => {
        await this.changeProgramStatus(manager, id);
        const p = await manager.findOne(PersonRole, {
          where: {
            program: {
              id: id,
            },
            end_date: IsNull(),
            role: {
              id: 4,
            },
          },
          relations: {
            headquarters: true,
            group: true,
            person: true,
          },
        });
        assertFound(p, 'No se pudo desactivar el programa, intente nuevamente');
        await manager.update(PersonRole, p.id, {
          end_date: new Date(),
        });
        const newRole = manager.create(PersonRole, {
          person: {
            id: p.person.id,
          },
          headquarters: {
            id: p.headquarters.id,
          },
          role: {
            id: 5,
          },
          group: {
            id: p.group.id,
          },
        });
        await manager.save(newRole);
        return {
          success: true,
          message: 'Se desactivo el programa correctamente',
        };
      },
    );
  }

  async changeCoordinator(dto: ChangeCoordinatorProgramsDto) {
    return await this.programHeadquartersRepository.manager.transaction(
      async (manager) => {
        const pr = await manager.findOne(PersonRole, {
          where: {
            headquarters: {
              id: dto.idSectional,
            },
            program: {
              id: dto.idProgramsHeadquarters,
            },
            role: {
              id: 4,
            },
            end_date: IsNull(),
          },
          relations: {
            group: true,
            person: true,
          },
        });
        assertFound(
          pr,
          'No se encontro un rol activo para la persona seleccionada',
        );
        console.log(pr.person);
        await this.closeCoordinatorRoleCurrent(
          manager,
          pr,
          dto.idSectional,
          dto.idProgramsHeadquarters,
        );
        await this.assignCoordinator(
          manager,
          dto.leader,
          dto.idSectional,
          pr.group.id,
          dto.idProgramsHeadquarters,
        );
        return {
          success: true,
          message: 'Se cambio el cordinador de la agrupacion de forma exixtosa',
        };
      },
    );
  }

  private async closeCoordinatorRoleCurrent(
    manager: EntityManager,
    coordCurrent: PersonRole,
    id_headquarters: number,
    id_program_headquarters: number,
  ) {
    if (coordCurrent) {
      await manager.update(PersonRole, coordCurrent.id, {
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
          id: coordCurrent.group.id,
        },
        program: {
          id: id_program_headquarters,
        },
      });
    }
  }

  async findOneById(id_headquarters: number, id_program: number) {
    return this.programHeadquartersRepository.findOne({
      where: {
        headquarters: {
          id: id_headquarters,
        },
        program: {
          id: id_program,
        },
      },
    });
  }
}
