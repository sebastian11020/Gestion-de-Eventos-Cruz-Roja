import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { type_state } from '../enum/state-type.enum';
import { PersonStatus } from '../../person-status/entity/person-status.entity';
import { HeadquartersStatus } from '../../headquarters-status/entity/headquarters-status.entity';
import { GroupStatus } from '../../group-status/entity/group-status.entity';
import { ProgramStatus } from '../../program-status/entity/program-status.entity';
import { EventStatus } from '../../event-status/entity/event-status.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  type: type_state;
  @OneToMany(() => PersonStatus, (personStatus) => personStatus.state)
  person_status: PersonStatus[];
  @OneToMany(() => HeadquartersStatus, (hs) => hs.state)
  headquarters_status: HeadquartersStatus[];
  @OneToMany(() => GroupStatus, (gs) => gs.state)
  group_status: GroupStatus[];
  @OneToMany(() => ProgramStatus, (ps) => ps.state)
  program_status: ProgramStatus[];
  @OneToMany(() => EventStatus, (es) => es.state)
  event_status: EventStatus[];
}
