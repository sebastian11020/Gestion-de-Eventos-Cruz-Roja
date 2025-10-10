import { Injectable } from '@nestjs/common';
import { Headquarters } from './entity/headquarters.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { LocationService } from '../location/location.service';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import { LocationTypeEnum } from '../location/enum/location-type.enum';
import { GetHeadquartersDto } from './dto/get-headquarters.dto';
import { FormatNamesString } from '../../common/utils/string.utils';
import { Location } from '../location/entity/location.entity';
import { HeadquartersStatus } from '../headquarters-status/entity/headquarters-status.entity';
import { PersonRole } from '../person-role/entity/person-role.entity';
import { HeadquartersTypeEnum } from './enum/headquarters-type.enum';

@Injectable()
export class HeadquartersService {
  constructor(
    @InjectRepository(Headquarters)
    private headquartersRepository: Repository<Headquarters>,
    private locationService: LocationService,
  ) {}

  async getAllDto(): Promise<GetHeadquartersDto[]> {
    const rows: {
      id: number;
      city: string;
      type: string;
      number_volunteers: number;
      number_groups: number;
    }[] = await this.headquartersRepository.query(
      'select * from public.list_headquarters_with_metrics($1, $2)',
      ['ACTIVO', true],
    );
    return rows.map((row) => {
      const dto = new GetHeadquartersDto();
      dto.id = String(row.id);
      dto.type = FormatNamesString(String(row.type ?? ''));
      dto.city = FormatNamesString(String(row.city ?? ''));
      dto.numberVolunteers = String(row.number_volunteers ?? 0);
      dto.numberGroups = String(row.number_groups ?? 0);
      return dto;
    });
  }

  async getAllWithGroupsAndPrograms() {
    const rows: {
      id: number;
      city: string;
      groups: [id: number, name: string, programs: [id: number, name: string]];
    }[] = await this.headquartersRepository.query(
      'select * from public.list_headquarters_with_groups_and_programs()',
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
          }
        } else {
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
          dto.document_leader,
          headquarter.id,
          headquarter.type === HeadquartersTypeEnum.SEDE_SECCIONAL,
        );
        return { success: true, message: message };
      },
    );
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
    console.log('Rol persona actual');
    console.log(personRol);
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
    await this.headquartersRepository.query(
      'select * from public.deactivate_headquarters($1)',
      [id],
    );
    return { success: true };
  }

  async getById(id: number) {
    const headquarter = await this.headquartersRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(headquarter, `No se encontro una sede con el id ${id}`);
    return headquarter;
  }
}
