import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '../../state/entity/state.entity';
import { Event as EventEntity } from '../../event/entity/event.entity';

@Entity()
export class EventStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => EventEntity, (e) => e)
  @JoinColumn({ name: 'id_event' })
  event: EventEntity;
  @ManyToOne(() => State, (s) => s.group_status)
  @JoinColumn({ name: 'id_state' })
  state: State;
}
