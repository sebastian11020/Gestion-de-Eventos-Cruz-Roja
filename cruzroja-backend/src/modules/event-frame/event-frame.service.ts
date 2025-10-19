import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventFrame } from './entity/event-frame';
import { Repository } from 'typeorm';
import { CreateEventFrameDto } from './dto/create-event-frame.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GetEventFrameDto } from './dto/get-event-frame.dto';

@Injectable()
export class EventFrameService {
  constructor(
    @InjectRepository(EventFrame)
    private eventFrameService: Repository<EventFrame>,
  ) {}

  async create(dto: CreateEventFrameDto) {
    await this.eventFrameService.save(
      this.eventFrameService.create({
        name: NormalizeString(dto.name),
      }),
    );
    return {
      success: true,
      message: 'Se creo correctamente el marco de evento',
    };
  }

  async getAll(): Promise<GetEventFrameDto[]> {
    const rows = await this.eventFrameService.find();
    return rows.map((row) => {
      const dto = new GetEventFrameDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      return dto;
    });
  }
}
