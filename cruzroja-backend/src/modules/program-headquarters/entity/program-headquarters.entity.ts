import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { Program } from '../../program/entity/program.entity';
import { PersonRole } from '../../person-role/entity/person-role.entity';
import { ProgramStatus } from '../../program-status/entity/program-status.entity';

@Entity()
export class ProgramHeadquarters {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Program, (program) => program.programHeadquarters)
  @JoinColumn({ name: 'id_program' })
  program: Program;

  @ManyToOne(
    () => Headquarters,
    (headquarters) => headquarters.programHeadquarters,
  )
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;

  @OneToMany(() => PersonRole, (pr) => pr.program)
  personRole: PersonRole[];

  @OneToMany(() => ProgramStatus, (ps) => ps.programHeadquarters)
  programStatus: ProgramStatus[];
}
