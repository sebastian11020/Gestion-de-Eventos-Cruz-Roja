import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event as EventEntity } from '../../event/entity/event.entity';
import { Skill } from '../../skill/entity/skill.entity';

@Entity()
export class EventQuota {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  quota: number;
  @Column()
  taken: number;
  @ManyToOne(() => EventEntity, (e) => e)
  @JoinColumn({ name: 'id_event' })
  event: EventEntity;
  @ManyToOne(() => Skill, (s) => s)
  @JoinColumn({ name: 'id_skill' })
  skill: Skill;
}
