import { Injectable } from '@nestjs/common';
import { Headquarters } from './entity/headquarters.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import { LocationTypeEnum } from '../location/enum/location-type.enum';
import { GetHeadquartersDto } from './dto/get-headquarters.dto';
import { FormatNamesString } from '../../common/utils/string.utils';
import { Location } from '../location/entity/location.entity';
import { HeadquartersStatus } from '../headquarters-status/entity/headquarters-status.entity';
import { PersonRole } from '../person-role/entity/person-role.entity';
import { HeadquartersTypeEnum } from './enum/headquarters-type.enum';
import { GetHeadquartersGroupsProgramsDto } from './dto/get-headquarters-groups-programs.dto';
import { ChangeLeaderHeadquartersDto } from './dto/change-leader-headquarters.dto';
import { PersonService } from '../person/person.service';

@Injectable()
export class HeadquartersService {
  constructor(
    @InjectRepository(Headquarters)
    private headquartersRepository: Repository<Headquarters>,
    private personService: PersonService,
  ) {}

  async getAllDto(): Promise<GetHeadquartersDto[]> {
    const rows: {
      id: number;
      city: string;
      type: string;
      number_volunteers: number;
      number_groups: number;
      leader: {
        document: string;
        name: string;
      };
    }[] = await this.headquartersRepository.query(
      'select * from public.get_active_headquarters()',
    );
    return rows.map((row) => {
      const dto = new GetHeadquartersDto();
      dto.id = String(row.id);
      dto.type = FormatNamesString(String(row.type ?? ''));
      dto.city = FormatNamesString(String(row.city ?? ''));
      dto.numberVolunteers = String(row.number_volunteers ?? 0);
      dto.numberGroups = String(row.number_groups ?? 0);
      dto.leader = {
        document: row.leader.document,
        name: FormatNamesString(row.leader.name),
      };
      return dto;
    });
  }

  async getAllWithGroupsAndMissingPrograms() {
    const rows: {
      id: number;
      city: string;
      groups: [id: number, name: string, program: [id: number, name: string]];
    }[] = await this.headquartersRepository.query(
      'select * from public.list_headquarters_with_missing_programs()',
    );
    return rows;
  }

  async getAllWithGroupsAndPrograms() {
    const rows: {
      id: number;
      city: string;
      groups: [id: number, name: string, program: [id: number, name: string]];
    }[] = await this.headquartersRepository.query(
      'select * from public.list_headquarters_with_groups_and_programs()',
    );
    return rows;
  }

  async getInfoTable(id: number) {
    const rows: GetHeadquartersGroupsProgramsDto =
      await this.headquartersRepository.query(
        'select * from public.list_groups_with_leader_and_programs_by_hq($1)',
        [id],
      );
    return rows;
  }

  async create(dto: CreateHeadquartersDto) {
    return await this.headquartersRepository.manager.transaction(
      async (manager) => {
        let message: string = '';
        const location = await manager.findOne(Location, {
          where: {
            id: dto.idLocation,
          },
          relations: {
            parent: true,
          },
        });
        assertFound(
          location,
          `No se encontro una ubicacion asociada al id: ${dto.idLocation}`,
        );
        assert(
          location.type == LocationTypeEnum.MUNICIPIO,
          `Las sedes solo se pueden crear en municipios y el id ${dto.idLocation} pertenece a un ${location.type}`,
        );

        let headquarter: Headquarters | null = await manager.findOne(
          Headquarters,
          {
            where: {
              location: { id: location.id },
            },
          },
        );
        if (headquarter) {
          if (await this.verifiedHeadquartersStatus(manager, headquarter.id)) {
            conflict(`No se puede crear otra sede en ${location.name}`);
          } else {
            message = 'La sede se reactivo correctamente';
            if (headquarter.type != dto.type) {
              await manager.update(Headquarters, headquarter.id, {
                type: dto.type,
              });
            }
          }
        } else {
          if (await this.thereIsSectionalInDepartment(location)) {
            conflict('Solo puede haber una sede seccional por departamento');
          }
          message = 'La sede se creo correctamente';
          headquarter = manager.create(Headquarters, {
            type: dto.type,
            location,
          });
          await manager.save(headquarter);
        }
        await this.changeHeadquartersStatus(manager, headquarter.id);
        await this.assignLeader(
          manager,
          dto.leader,
          headquarter.id,
          headquarter.type === HeadquartersTypeEnum.SEDE_SECCIONAL,
        );
        return { success: true, message: message };
      },
    );
  }

  private async thereIsSectionalInDepartment(location: Location) {
    const headquarters = await this.headquartersRepository.findOne({
      where: {
        type: HeadquartersTypeEnum.SEDE_SECCIONAL,
        location: {
          parent: {
            id: location.parent?.id ?? 0,
            type: LocationTypeEnum.DEPARTAMENTO,
          },
        },
      },
    });
    return headquarters != null;
  }

  private async assignLeader(
    manager: EntityManager,
    document: string,
    id_headquarters: number,
    isSectional: boolean,
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
    personRol.end_date = new Date();
    await manager.update(PersonRole, personRol.id, {
      end_date: new Date(),
    });
    let aux: number = 2;
    if (isSectional) {
      aux = 1;
    }
    await manager.save(
      manager.create(PersonRole, {
        person: {
          id: personRol.person.id,
        },
        role: {
          id: aux,
        },
        headquarters: {
          id: id_headquarters,
        },
      }),
    );
  }

  private async verifiedHeadquartersStatus(manager: EntityManager, id: number) {
    const row = await manager.findOne(HeadquartersStatus, {
      where: {
        id: id,
        end_date: IsNull(),
      },
    });
    return !!(row && row.state.name === 'ACTIVO');
  }

  private async changeHeadquartersStatus(manager: EntityManager, id: number) {
    const row = await manager.findOne(HeadquartersStatus, {
      where: {
        id: id,
        end_date: IsNull(),
      },
    });
    let newStatus: HeadquartersStatus;
    if (row) {
      await manager.update(HeadquartersStatus, id, {
        end_date: new Date(),
      });
      if (row.state.name === 'ACTIVO') {
        newStatus = manager.create(HeadquartersStatus, {
          state: {
            id: 2,
          },
          headquarters: {
            id: id,
          },
        });
      } else {
        newStatus = manager.create(HeadquartersStatus, {
          state: {
            id: 1,
          },
          headquarters: {
            id: id,
          },
        });
      }
    } else {
      newStatus = manager.create(HeadquartersStatus, {
        state: {
          id: 1,
        },
        headquarters: {
          id: id,
        },
      });
    }
    await manager.save(newStatus);
  }

  async deactivate(id: number) {
    const headquarter: Headquarters | null =
      await this.headquartersRepository.findOne({
        where: {
          id: id,
        },
      });
    assertFound(
      headquarter,
      `No se encontro una sede con el sigueinte id: ${id}`,
    );
    if (await this.personService.thereAreActiveVolunteersActive(id)) {
      return {
        success: false,
        message:
          'No se puede eliminar una sede que tenga voluntarios activos, en formacion o en licencia',
      };
    } else {
      await this.headquartersRepository.query(
        'select * from public.deactivate_headquarters_cascade($1)',
        [id],
      );
      return { success: true, message: 'Se elimino la sede correctamente' };
    }
  }

  async getById(id: number) {
    const headquarter = await this.headquartersRepository.findOne({
      where: {
        id: id,
        personRole: {
          role: {
            name: In(['LIDER SEDE', 'LIDER VOLUNTARIADO']),
          },
        },
      },
      relations: {
        personRole: {
          person: true,
        },
      },
    });
    assertFound(headquarter, `No se encontro una sede con el id ${id}`);
    return headquarter;
  }

  async changeLeader(dto: ChangeLeaderHeadquartersDto) {
    return await this.headquartersRepository.manager.transaction(
      async (manager) => {
        const personRol = await manager.findOne(PersonRole, {
          where: {
            headquarters: {
              id: dto.idSectional,
            },
            role: {
              name: In(['LIDER SEDE', 'LIDER VOLUNTARIADO']),
            },
            end_date: IsNull(),
          },
          relations: {
            person: true,
          },
        });
        console.log(dto);
        assertFound(personRol, 'No se encontro un lider activo en esta sede');
        await manager.update(PersonRole, personRol.id, {
          end_date: new Date(),
        });
        await manager.save(
          manager.create(PersonRole, {
            person: {
              id: personRol.person.id,
            },
            headquarters: {
              id: dto.idSectional,
            },
            role: {
              id: 5,
            },
          }),
        );
        const headquarters = await this.getById(dto.idSectional);
        if (headquarters.type === HeadquartersTypeEnum.SEDE_SECCIONAL) {
          await this.assignLeader(manager, dto.leader, dto.idSectional, true);
        } else {
          await this.assignLeader(manager, dto.leader, dto.idSectional, false);
        }
        return { success: true, message: 'Se cambio correctamente el lider' };
      },
    );
  }
}
