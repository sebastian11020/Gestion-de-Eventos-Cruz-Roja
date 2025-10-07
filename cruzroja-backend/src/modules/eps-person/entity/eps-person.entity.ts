import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { type_affiliation } from '../enum/eps-person.enum';
import { Person } from '../../person/entity/person.entity';
import { Eps } from '../../eps/entity/eps.entity';

@Entity({ name: 'eps_person' })
export class EpsPerson {
  @PrimaryColumn('uuid')
  id_person: string;
  @PrimaryColumn()
  id_eps: number;
  @Column()
  affiliation: type_affiliation;
  @ManyToOne(() => Person, (person) => person)
  @JoinColumn({ name: 'id_person' })
  person: Person;
  @ManyToOne(() => Eps, (eps) => eps.eps_person)
  @JoinColumn({ name: 'id_eps' })
  eps: Eps;
}
