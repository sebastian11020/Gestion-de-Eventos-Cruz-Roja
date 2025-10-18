import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonRole } from './entity/person-role.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PersonRoleService {
  constructor(
    @InjectRepository(PersonRole)
    private personRoleRepository: Repository<PersonRole>,
  ) {}

  async findPersonCurrentRole(id_person: string): Promise<PersonRole | null> {
    return await this.personRoleRepository.findOne({
      where: {
        person: {
          id: id_person,
        },
        end_date: IsNull(),
      },
      relations: {
        headquarters: true,
        group: true,
        program: true,
      },
    });
  }
}
