import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { State } from '../../state/entity/state.entity';

@Entity()
export class HeadquartersStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => Headquarters, (h) => h.status)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
  @ManyToOne(() => State, (s) => s.headquarters_status)
  @JoinColumn({ name: 'id_state' })
  state: State;
}
