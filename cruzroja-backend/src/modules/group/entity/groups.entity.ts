import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Program } from '../../program/entity/program.entity';
import { Person } from '../../person/entity/person.entity';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Program, (program) => program.group)
  programs: Program[];
  @OneToMany(() => Person, (p) => p.group)
  persons: Person[];
  @OneToMany(() => GroupHeadquarters, (gh) => gh.headquarters)
  groupHeadquarters: GroupHeadquarters[];
}
