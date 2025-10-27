import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonSkill } from '../../person-skill/entity/person-skill.entity';
import { EventQuota } from '../../event-quota/entity/event-quota.entity';
import { EventEnrollment } from '../../event-enrollment/entity/event-enrollment.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => PersonSkill, (ps) => ps.skill)
  person_skills: PersonSkill[];
  @OneToMany(() => EventQuota, (eq) => eq.skill)
  event_quotas: EventQuota[];
  @OneToMany(() => EventEnrollment, (e) => e.skill)
  event_enrollments: EventEnrollment[];
}
