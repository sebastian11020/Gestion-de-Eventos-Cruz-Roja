import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';
import { State } from '../../state/entity/state.entity';

@Entity()
export class GroupStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => GroupHeadquarters, (gh) => gh.states)
  @JoinColumn({ name: 'id_group_headquarters' })
  groupHeadquarters: GroupHeadquarters;
  @ManyToOne(() => State, (s) => s.group_status)
  @JoinColumn({ name: 'id_state' })
  state: State;
}
