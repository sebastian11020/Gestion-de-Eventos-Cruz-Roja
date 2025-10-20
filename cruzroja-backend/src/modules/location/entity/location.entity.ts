import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationTypeEnum } from '../enum/location-type.enum';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { Person } from '../../person/entity/person.entity';
import { Event } from '../../event/entity/event.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  name: string;
  @Column({
    type: 'enum',
    enum: LocationTypeEnum,
    enumName: 'location_type',
  })
  type: LocationTypeEnum;
  @ManyToOne(() => Location, (location) => location.children, {
    nullable: true,
  })
  parent?: Location;
  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
  @OneToMany(() => Headquarters, (h) => h.location)
  headquarters: Headquarters[];
  @OneToMany(() => Person, (p) => p.location)
  persons: Person[];
  @OneToMany(() => Event, (event) => event.location)
  events: Event[];
}
