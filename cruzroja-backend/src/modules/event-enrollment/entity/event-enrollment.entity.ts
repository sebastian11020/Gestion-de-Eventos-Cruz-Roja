import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event as EventEntity } from '../../event/entity/event.entity';
import { Person } from '../../person/entity/person.entity';
import { Skill } from '../../skill/entity/skill.entity';
import { EventAttendance } from '../../event_attendance/entity/event_attendance.entity';

@Entity()
export class EventEnrollment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  created_at: Date;
  @Column()
  updated_at: Date;
  @Column()
  state: boolean;
  @ManyToOne(() => EventEntity, (e) => e.event_enrollment)
  @JoinColumn({ name: 'id_event' })
  event: EventEntity;
  @ManyToOne(() => Person, (p) => p.event_enrollment)
  @JoinColumn({ name: 'id_person' })
  person: Person;
  @ManyToOne(() => Skill, (s) => s.event_enrollments)
  @JoinColumn({ name: 'id_skill' })
  skill: Skill;
  @OneToMany(() => EventAttendance, (ea) => ea.enrollment)
  event_attendances: EventAttendance[];
}
