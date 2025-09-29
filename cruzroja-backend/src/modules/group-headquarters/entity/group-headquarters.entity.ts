import { PrimaryColumn, Entity, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';

@Entity()
export class GroupHeadquarters {
  @PrimaryColumn({ name: 'id_group' })
  idGroup: number;

  @PrimaryColumn({ name: 'id_headquarters' })
  idHeadquarters: number;

  @Column()
  state: boolean;

  @ManyToOne(() => Groups, (group) => group.id)
  @JoinColumn({ name: 'id_group' })
  group: Groups;

  @ManyToOne(() => Headquarters, (headquarters) => headquarters.id)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
}
