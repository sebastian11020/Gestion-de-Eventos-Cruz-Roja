import { Injectable } from '@nestjs/common';
import { Headquarters } from './entity/headquarters.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHeadquartersDto } from './dto/create-headquarters.dto';
import { LocationService } from '../location/location.service';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import { LocationTypeEnum } from '../location/enum/location-type.enum';
import { GetHeadquartersDto } from './dto/get-headquarters.dto';
import { FormatNamesString } from '../../common/utils/string.utils';

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
    const location = await this.locationService.getById(dto.idLocation);
    assertFound(
      location,
      `No se encontro una ubicacion asociada al id: ${dto.idLocation}`,
    );
    assert(
      location.type == LocationTypeEnum.MUNICIPIO,
      `Las sedes solo se pueden crear en municipios y el id ${dto.idLocation} pertenece a un ${location.type}`,
    );

    let headquarter: Headquarters | null =
      await this.headquartersRepository.findOne({
        where: {
          location: { id: location.id },
        },
      });

    if (headquarter) {
      if (headquarter.state) {
        conflict(`No se puede crear otra sede en ${location.name}`);
      } else headquarter.state = true;
    } else {
      headquarter = this.headquartersRepository.create({
        type: dto.type,
        location,
        state: true,
      });
    }
    await this.headquartersRepository.save(headquarter);
    return { success: true };
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
