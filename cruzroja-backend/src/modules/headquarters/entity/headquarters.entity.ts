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
import { Person } from '../../person/entity/person.entity';

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
  @OneToMany(() => Person, (p) => p.id)
  persons: Person[];
}
