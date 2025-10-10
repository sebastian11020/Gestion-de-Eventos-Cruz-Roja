import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { State } from './entity/state.entity';
import { Repository } from 'typeorm';
import { conflict } from '../../common/utils/assert';
import { InjectRepository } from '@nestjs/typeorm';
import { GetStateDto } from './dto/get-state.dto';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State) private stateRepository: Repository<State>,
  ) {}

  async create(createStateDto: CreateStateDto) {
    let state = await this.stateRepository.findOne({
      where: {
        name: NormalizeString(createStateDto.name),
        type: createStateDto.type,
      },
    });
    if (state) {
      conflict(`Ya existe el estado ${FormatNamesString(state.name)}`);
    } else {
      state = this.stateRepository.create({
        name: NormalizeString(createStateDto.name),
        type: createStateDto.type,
      });
    }
    await this.stateRepository.save(state);
    return {
      success: true,
      message: `El estado: ${FormatNamesString(state.name)} se creo correctamente`,
    };
  }

  async getAll(): Promise<GetStateDto[]> {
    return await this.stateRepository.find();
  }

  async update(id: number, dto: CreateStateDto) {
    await this.stateRepository.update(id, dto);
    return {
      success: true,
      message: 'El estado se actualizo exitosamente',
    };
  }
}
