import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HeadquartersTypeEnum } from '../enum/headquarters-type.enum';
import { Location } from '../../location/entity/location.entity';
import { Person } from '../../person/entity/person.entity';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';
import { ProgramHeadquarters } from '../../program-headquarters/entity/program-headquarters.entity';

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
  @OneToMany(() => Person, (p) => p.headquarters)
  persons: Person[];
  @OneToMany(() => GroupHeadquarters, (gh) => gh.headquarters)
  groupHeadquarters: GroupHeadquarters[];
  @OneToMany(() => ProgramHeadquarters, (ph) => ph.headquarters)
  programHeadquarters: ProgramHeadquarters[];
}
