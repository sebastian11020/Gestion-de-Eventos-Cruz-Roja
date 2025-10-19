import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scope } from './entity/scope.entity';
import { CreateScopeDto } from './dto/create-scope.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GetScopeDto } from './dto/get-scope.dto';

@Injectable()
export class ScopeService {
  constructor(
    @InjectRepository(Scope) private scopeRepository: Repository<Scope>,
  ) {}

  async getAll(): Promise<GetScopeDto[]> {
    const rows = await this.scopeRepository.find();
    return rows.map((row) => {
      const dto = new GetScopeDto();
      dto.name = FormatNamesString(row.name);
      return dto;
    });
  }

  async create(dto: CreateScopeDto) {
    await this.scopeRepository.save(
      this.scopeRepository.create({ name: NormalizeString(dto.name) }),
    );
    return { success: true, message: 'Se creo correctamente el ambito' };
  }
}
