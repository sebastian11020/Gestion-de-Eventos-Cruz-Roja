import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Skill } from '../../skill/entity/skill.entity';
import { Person } from '../../person/entity/person.entity';

@Entity()
export class PersonSkill {
  @PrimaryColumn()
  id_skill: number;
  @PrimaryColumn()
  id_person: string;
  @Column()
  registration_date: Date;
  @Column()
  state: boolean;
  @ManyToOne(() => Skill, (skill) => skill.person_skills)
  @JoinColumn({ name: 'id_skill' })
  skill: Skill;
  @ManyToOne(() => Person, (p) => p.person_skills)
  @JoinColumn({ name: 'id_person' })
  person: Person;
}
