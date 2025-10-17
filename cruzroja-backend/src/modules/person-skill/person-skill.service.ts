import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonSkill } from './entity/person-skill.entity';

@Injectable()
export class PersonSkillService {
  constructor(
    @InjectRepository(PersonSkill)
    private personSkillRepository: Repository<PersonSkill>,
  ) {}

  async findByIds(
    id_person: string,
    id_skill: number,
  ): Promise<PersonSkill | null> {
    return await this.personSkillRepository.findOne({
      where: {
        id_person: id_person,
        id_skill: id_skill,
      },
    });
  }

  async getSkillsPerson(id_person: string) {
    return this.personSkillRepository.find({
      where: {
        person: {
          id: id_person,
        },
      },
      relations: {
        skill: true,
      },
    });
  }
}
