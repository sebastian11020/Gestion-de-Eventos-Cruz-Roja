import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '../../state/entity/state.entity';
import { ProgramHeadquarters } from '../../program-headquarters/entity/program-headquarters.entity';

@Entity()
export class ProgramStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => ProgramHeadquarters, (ph) => ph.programStatus)
  @JoinColumn({ name: 'id_program_headquarters' })
  programHeadquarters: ProgramHeadquarters;
  @ManyToOne(() => State, (s) => s.program_status)
  @JoinColumn({ name: 'id_state' })
  state: State;
}
