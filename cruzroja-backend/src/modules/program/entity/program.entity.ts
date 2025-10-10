import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';
import { ProgramHeadquarters } from '../../program-headquarters/entity/program-headquarters.entity';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Groups, (group) => group.programs)
  @JoinColumn({ name: 'id_group' })
  group: Groups;
  @OneToMany(() => ProgramHeadquarters, (ph) => ph.headquarters)
  programHeadquarters: ProgramHeadquarters[];
}
