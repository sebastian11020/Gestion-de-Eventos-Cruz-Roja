import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { type_state } from '../enum/state-type.enum';
import { PersonStatus } from '../../person-status/entity/person-status.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  type: type_state;
  @OneToMany(() => PersonStatus, (personStatus) => personStatus.person)
  person_status: PersonStatus[];
}
