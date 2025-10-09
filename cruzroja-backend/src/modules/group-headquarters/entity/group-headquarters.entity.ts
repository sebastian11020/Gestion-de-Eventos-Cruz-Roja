import {
  PrimaryColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { PersonRole } from '../../person-role/entity/person-role.entity';

@Entity()
export class GroupHeadquarters {
  @PrimaryColumn()
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
}
