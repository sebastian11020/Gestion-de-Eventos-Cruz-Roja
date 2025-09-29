import { Injectable } from '@nestjs/common';
import { FormatNamesString } from '../../common/utils/string.utils';
import { assertFound, conflict } from '../../common/utils/assert';
import { ProgramHeadquarters } from './entity/program-headquarters.entity';
import { HeadquartersService } from '../headquarters/headquarters.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AssociateProgramHeadquarters } from './dto/associate-program-headquarters';
import { GetProgramHeadquartersDto } from './dto/get-program-headquarters';

@Injectable()
export class ProgramHeadquartersService {
  constructor(
    @InjectRepository(ProgramHeadquarters)
    private programHeadquartersRepository: Repository<ProgramHeadquarters>,
    private headquartersService: HeadquartersService,
  ) {}

  async getAllProgramHeadquartersDto() {
    const rows: {
      id: number;
      name: string;
      sectional: string;
      group: string;
      number_volunteers: number;
      leader?: {
        document?: string;
        name?: string;
      };
    }[] = await this.programHeadquartersRepository.query(
      'select * from public.list_programs_with_details()',
    );
    return rows.map((row) => {
      const dto = new GetProgramHeadquartersDto();
      dto.id = String(row.id);
      dto.name = FormatNamesString(row.name);
      dto.sectional = FormatNamesString(row.sectional);
      dto.group = FormatNamesString(row.group);
      dto.numberVolunteers = String(row.number_volunteers);
      dto.leader = row.leader;
      return dto;
    });
  }

  private async checkStatusHeadquarters(id: number) {
    const headquarters = await this.headquartersService.getById(id);
    return headquarters.state;
  }

  async createOrActivate(dto: AssociateProgramHeadquarters) {
    if (!(await this.checkStatusHeadquarters(dto.idHeadquarters))) {
      conflict('No se puede activar un programa en una sede inactiva');
    }
    let object = await this.programHeadquartersRepository.findOne({
      where: {
        idProgram: dto.idProgram,
        idHeadquarters: dto.idHeadquarters,
      },
    });
    if (!object) {
      object = this.programHeadquartersRepository.create({
        idProgram: dto.idProgram,
        idHeadquarters: dto.idHeadquarters,
        state: true,
      });
    } else {
      if (!object.state) {
        object.state = true;
      } else {
        conflict(
          `La sede de ${object.headquarters.location.name} ya tiene el programa ${object.program.name} activo`,
        );
      }
    }
    await this.programHeadquartersRepository.save(object);
    return { success: true };
  }

  async deactivate(idProgram: number, idHeadquarters: number) {
    const object = await this.programHeadquartersRepository.findOne({
      where: {
        idProgram: idProgram,
        idHeadquarters: idHeadquarters,
      },
    });
    assertFound(object, `No se encontro la agrupacion que deseas desactivar`);
    object.state = false;
    await this.programHeadquartersRepository.save(object);
    return { success: true };
  }
}
