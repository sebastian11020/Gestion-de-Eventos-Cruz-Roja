import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event as EventEntity } from '../../event/entity/event.entity';
import { Person } from '../../person/entity/person.entity';
import { Skill } from '../../skill/entity/skill.entity';

@Entity()
export class ManagerEvent {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => Person, (p) => p.manager_events)
  @JoinColumn({ name: 'id_person' })
  person: Person;
}
