import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Program } from '../../program/entity/program.entity';

@Entity()
export class Groups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Program, (program) => program.id)
  programs: Program[];
}
