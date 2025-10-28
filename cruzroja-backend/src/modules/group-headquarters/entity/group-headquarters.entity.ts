import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { PersonRole } from '../../person-role/entity/person-role.entity';
import { GroupStatus } from '../../group-status/entity/group-status.entity';
import { Event } from '../../event/entity/event.entity';

@Entity()
export class GroupHeadquarters {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Groups, (group) => group.groupHeadquarters)
  @JoinColumn({ name: 'id_group' })
  group: Groups;

  @ManyToOne(
    () => Headquarters,
    (headquarters) => headquarters.groupHeadquarters,
  )
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;

  @OneToMany(() => PersonRole, (pr) => pr.group)
  personRole: PersonRole[];

  @OneToMany(() => GroupStatus, (gs) => gs.groupHeadquarters)
  states: GroupStatus[];

  @OneToMany(() => Event, (e) => e.groupHeadquarters)
  events: Event[];
}
