import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpsPerson } from './entity/eps-person.entity';
import { Repository } from 'typeorm';
import { CreateEpsPersonDTO } from './dto/create-eps-person.dto';

@Injectable()
export class EpsPersonService {
  constructor(
    @InjectRepository(EpsPerson)
    private epsPersonRepository: Repository<EpsPerson>,
  ) {}

  async create(dto: CreateEpsPersonDTO) {
    const affiliation = this.epsPersonRepository.create({
      id_person: dto.id_person,
      id_eps: dto.id_eps,
      affiliation: dto.affiliation,
    });
    await this.epsPersonRepository.save(affiliation);
  }
}
