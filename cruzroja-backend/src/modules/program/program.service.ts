import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './entity/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { GroupService } from '../group/group.service';
import { assertFound, conflict } from '../../common/utils/assert';
import { Repository } from 'typeorm';
import {
  FormatNamesString,
  NormalizeString,
} from '../../common/utils/string.utils';
import { UpdateProgramDto } from './dto/update-program.dto';
import { GetProgramDto } from './dto/get-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program) private programRepository: Repository<Program>,
    private groupService: GroupService,
  ) {}

  async getAllDto(): Promise<GetProgramDto[]> {
    const rows = await this.programRepository.find();
    return rows.map((row) => {
      const dto = new GetProgramDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      return dto;
    });
  }

  async create(dto: CreateProgramDto) {
    const group = await this.groupService.getById(dto.id_group);
    assertFound(
      group,
      `No se encontro una agrupacion asociada al id ${dto.id_group}`,
    );
    let program = await this.programRepository.findOne({
      where: {
        name: NormalizeString(dto.name),
      },
    });
    if (program) {
      conflict(
        `Ya hay un programa con el sigueinte nombre ${FormatNamesString(dto.name)}`,
      );
    } else {
      program = this.programRepository.create({
        name: NormalizeString(dto.name),
        group,
      });
    }
    await this.programRepository.save(program);
    return { success: true };
  }

  async update(id: number, dto: UpdateProgramDto) {
    const program = await this.programRepository.findOne({
      where: {
        id: id,
      },
    });
    assertFound(program, `No se encontro un programa asociado al id ${id}`);
    if (
      await this.programRepository.findOne({
        where: {
          name: NormalizeString(dto.name),
        },
      })
    ) {
      conflict(
        `Ya existe un programa con el nombre ${FormatNamesString(dto.name)}`,
      );
    }
    program.name = NormalizeString(dto.name);
    await this.programRepository.save(program);
    return { success: true };
  }
}
