import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Eps } from './entity/eps.entity';
import { Repository } from 'typeorm';
import { conflict } from '../../common/utils/assert';
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
    let eps = await this.epsRepository.findOne({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (eps) {
      conflict(`Ya existe la eps: ${eps.name}`);
    } else {
      eps = this.epsRepository.create({
        name: NormalizeString(dto.name),
      });
    }
    await this.epsRepository.save(eps);
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
    await this.epsRepository.update(id, {
      name: NormalizeString(dto.name),
    });
    return { success: true };
  }
}
