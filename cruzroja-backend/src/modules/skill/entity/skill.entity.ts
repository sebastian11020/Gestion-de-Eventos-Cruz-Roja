import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonSkill } from '../../person-skill/entity/person-skill.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => PersonSkill, (ps) => ps.skill)
  person_skills: PersonSkill[];
}
