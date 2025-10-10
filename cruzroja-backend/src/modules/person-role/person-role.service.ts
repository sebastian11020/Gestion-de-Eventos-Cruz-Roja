import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PersonRole } from './entity/person-role.entity';
import { CreatePersonRoleDto } from './dto/create-person-rol.dto';

@Injectable()
export class PersonRoleService {
  constructor(
    @InjectRepository(PersonRole)
    private personRoleRepository: Repository<PersonRole>,
  ) {}

  async create(dto: CreatePersonRoleDto) {
    return this.personRoleRepository.manager.transaction(async (manager) => {});
  }

  private async findPersonCurrentRole(
    manager: EntityManager,
    id_person: number,
  ): Promise<PersonRole | null> {
    return await manager.findOne(PersonRole, {});
  }
}
