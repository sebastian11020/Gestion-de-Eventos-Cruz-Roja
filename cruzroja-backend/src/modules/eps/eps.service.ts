import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Eps } from './entity/eps.entity';
import { Repository } from 'typeorm';
import { assertFound, conflict } from '../../common/utils/assert';
import { GetEpsDto } from './dto/get-eps.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { CreateEpsDto } from './dto/create-eps.dto';

@Injectable()
export class EpsService {
  constructor(@InjectRepository(Eps) private epsRepository: Repository<Eps>) {}

  async create(dto: CreateEpsDto) {
    const exist = await this.epsRepository.exists({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (exist) {
      conflict(`Ya existe una EPS con el nombre: ${dto.name}`);
    } else {
      const eps = this.epsRepository.create({
        name: NormalizeString(dto.name),
      });
      await this.epsRepository.save(eps);
    }
    return { success: true, message: 'Eps creada exitosamente' };
  }

  async getAllDto(): Promise<GetEpsDto[]> {
    const rows = await this.epsRepository.find();
    return rows.map((r) => {
      const dto = new GetEpsDto();
      dto.id = String(r.id);
      dto.name = FormatNamesString(r.name);
      return dto;
    });
  }

  async update(id: number, dto: CreateEpsDto) {
    const result = await this.epsRepository.update(id, {
      name: NormalizeString(dto.name),
    });
    assertFound(result.affected, 'No se encontro la eps con el id: ' + id);
    return { success: true, message: 'Eps actualizada exitosamente' };
  }
}
