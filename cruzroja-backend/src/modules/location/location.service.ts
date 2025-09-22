import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entity/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationTypeEnum } from './enum/location-type.enum';
import { assert, assertFound, conflict } from '../../common/utils/assert';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetLocationDto } from './dto/get-location.dto';

const REQUIRED_PARENT: Record<LocationTypeEnum, LocationTypeEnum | null> = {
  [LocationTypeEnum.DEPARTAMENTO]: null,
  [LocationTypeEnum.MUNICIPIO]: LocationTypeEnum.DEPARTAMENTO,
  [LocationTypeEnum.BARRIO]: LocationTypeEnum.MUNICIPIO,
};

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async getAllDto(): Promise<GetLocationDto[]> {
    const entities = await this.locationRepository.find();
    return entities.map((entity) => {
      const dto = new GetLocationDto();
      dto.id = entity.id;
      dto.name = FormatNamesString(entity.name);
      return dto;
    });
  }

  async getByIdDto(id: number): Promise<GetLocationDto | null> {
    const entity = await this.locationRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(
      entity,
      `No se encontro una ubicaion asociada al sigueinte id: ${id}`,
    );
    const dto = new GetLocationDto();
    dto.id = id;
    dto.name = FormatNamesString(entity.name);
    return dto;
  }

  async getByNameAndType(
    name: string,
    type: LocationTypeEnum,
  ): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: {
        name: NormalizeString(name),
        type: type,
      },
    });
  }

  async getById(id: number): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getMunicipalitiesByDepartmentDto(
    id: number,
  ): Promise<GetLocationDto[] | null> {
    const parent = await this.getById(id);
    assertFound(
      parent,
      `No se encontro una ubicacion relacionada al sigueinte id: ${id}`,
    );
    return this.locationRepository.find({
      where: {
        parent: parent,
      },
    });
  }

  async create(dto: CreateLocationDto) {
    const location: Location = this.locationRepository.create({
      name: NormalizeString(dto.name),
      type: dto.type,
    });

    const parent = await this.validateDependence(
      dto.name,
      dto.type,
      dto.parentId,
    );
    if (parent) {
      location.parent = parent;
    }

    if (await this.getByNameAndType(location.name, location.type))
      conflict(
        `Ya se encuentra una ubicacion registrada con el siguiente nombre: ${location.name}`,
      );
    await this.locationRepository.save(location);
    return { success: true };
  }

  async update(id: number, dto: UpdateLocationDto) {
    const location = await this.locationRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(
      location,
      `No se encontro una ubicaion asociada al siguiente id: ${id}`,
    );
    if (
      (await this.getByNameAndType(location.name, location.type))?.name !=
      location.name
    )
      conflict(
        `Ya se encuentra una ubicacion registrada con el siguiente nombre: ${location.name}`,
      );
    location.name = NormalizeString(dto.name);

    await this.locationRepository.update(dto.id, location);
    return { success: true };
  }

  private async validateDependence(
    name: string,
    type: LocationTypeEnum,
    parentId?: number | null,
  ): Promise<Location | null> {
    const expectedParent = REQUIRED_PARENT[type];
    if (expectedParent === null) {
      assert(!parentId, 'Los departamentos no tienen dependencias');
    } else {
      assert(parentId, ` ${name} depende de algun ${expectedParent}`);

      const parent: Location | null = await this.locationRepository.findOne({
        where: {
          id: parentId,
        },
      });

      assertFound(
        parent,
        `No se encontro una ubicacion asociada al siguiente id ${parentId}`,
      );

      assert(
        parent.type === expectedParent,
        `La dependencia deber ser con ${expectedParent} no con ${type}`,
      );
      return parent;
    }
    return null;
  }
}
