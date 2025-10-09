import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entity/role.entity';
import { Person } from '../../person/entity/person.entity';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';
import { ProgramHeadquarters } from '../../program-headquarters/entity/program-headquarters.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';

@Entity()
export class PersonRole {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start_date: Date;
  @Column({ nullable: true })
  end_date: Date;
  @ManyToOne(() => Role, (role) => role.person_roles)
  @JoinColumn({ name: 'id_role' })
  role: Role;
  @ManyToOne(() => Person, (p) => p.person_roles)
  @JoinColumn({ name: 'id_person' })
  person: Person;
  @ManyToOne(() => Headquarters, (h) => h.personRole)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
  @ManyToOne(() => GroupHeadquarters, (gh) => gh.personRole, { nullable: true })
  @JoinColumn({ name: 'id_group_headquarters' })
  group: GroupHeadquarters;
  @ManyToOne(() => ProgramHeadquarters, (ph) => ph.personRole, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_program_headquarters' })
  program: ProgramHeadquarters;
}
