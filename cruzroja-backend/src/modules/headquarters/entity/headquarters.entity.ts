import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HeadquartersTypeEnum } from '../enum/headquarters-type.enum';
import { Location } from '../../location/entity/location.entity';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';
import { ProgramHeadquarters } from '../../program-headquarters/entity/program-headquarters.entity';
import { PersonRole } from '../../person-role/entity/person-role.entity';
import { HeadquartersStatus } from '../../headquarters-status/entity/headquarters-status.entity';

@Entity()
export class Headquarters {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: HeadquartersTypeEnum;
  @Column()
  state: boolean;
  @ManyToOne(() => Location, (l) => l.headquarters, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location: Location;
  @OneToMany(() => GroupHeadquarters, (gh) => gh.headquarters)
  groupHeadquarters: GroupHeadquarters[];
  @OneToMany(() => ProgramHeadquarters, (ph) => ph.headquarters)
  programHeadquarters: ProgramHeadquarters[];
  @OneToMany(() => PersonRole, (pr) => pr.headquarters)
  personRole: PersonRole[];
  @OneToMany(() => HeadquartersStatus, (hs) => hs.headquarters)
  status: HeadquartersStatus[];
}
