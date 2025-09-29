import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { Program } from '../../program/entity/program.entity';

@Entity()
export class ProgramHeadquarters {
  @PrimaryColumn()
  @JoinColumn({ name: 'id_program' })
  idProgram: number;

  @PrimaryColumn()
  @JoinColumn({ name: 'id_headquarters' })
  idHeadquarters: number;

  @Column()
  state: boolean;

  @ManyToOne(() => Program, (program) => program.id)
  @JoinColumn({ name: 'id_program' })
  program: Program;

  @ManyToOne(() => Headquarters, (headquarters) => headquarters.id)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
}
