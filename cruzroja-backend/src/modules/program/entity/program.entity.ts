import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';
import { Person } from '../../person/entity/person.entity';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Groups, (group) => group.id)
  @JoinColumn({ name: 'id_group' })
  group: Groups;
  @OneToMany(() => Person, (person) => person.id)
  persons: Person[];
}
