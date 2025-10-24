import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonSkill } from '../../person-skill/entity/person-skill.entity';
import { ManagerEvent } from '../../manager-event/entity/manager-event.entity';
import { EventQuota } from '../../event-quota/entity/event-quota.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => PersonSkill, (ps) => ps.skill)
  person_skills: PersonSkill[];
  @OneToMany(() => EventQuota, (eq) => eq.skill)
  event_quotas: ManagerEvent[];
}
