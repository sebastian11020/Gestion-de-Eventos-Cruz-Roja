import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../person/entity/person.entity';
import { State } from '../../state/entity/state.entity';

@Entity()
export class PersonStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column({ nullable: true })
  end_date: Date;
  @ManyToOne(() => Person, (p) => p.person_status)
  @JoinColumn({ name: 'id_person' })
  person: Person;
  @ManyToOne(() => State, (s) => s.person_status)
  @JoinColumn({ name: 'id_state' })
  state: State;
}
