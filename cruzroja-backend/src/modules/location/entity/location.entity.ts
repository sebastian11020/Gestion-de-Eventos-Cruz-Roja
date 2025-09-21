import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationTypeEnum } from '../enum/location-type.enum';

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
}
