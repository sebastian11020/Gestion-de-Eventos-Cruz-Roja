import { Injectable } from '@nestjs/common';
import { ClassificationEvent } from './entity/classification-event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassificationEventDto } from './dto/create-classification-event.dto';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { GetClassificationEventDto } from './dto/get-classification-event.dto';

@Injectable()
export class ClassificationEventService {
  constructor(
    @InjectRepository(ClassificationEvent)
    private readonly ClassificationEventRepository: Repository<ClassificationEvent>,
  ) {}

  async create(dto: CreateClassificationEventDto) {
    await this.ClassificationEventRepository.save(
      this.ClassificationEventRepository.create({
        name: NormalizeString(dto.name),
      }),
    );
    return { success: true, message: dto };
  }

  async getAll(): Promise<GetClassificationEventDto[]> {
    const classificationEvent = await this.ClassificationEventRepository.find();
    return classificationEvent.map((row) => {
      const dto = new GetClassificationEventDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      return dto;
    });
  }
}
