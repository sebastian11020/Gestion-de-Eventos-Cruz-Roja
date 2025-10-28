import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EpsPerson } from '../../eps-person/entity/eps-person.entity';

@Entity()
export class Eps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => EpsPerson, (epsP) => epsP.eps)
  eps_person: EpsPerson[];
}
