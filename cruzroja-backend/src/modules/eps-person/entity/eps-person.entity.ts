import { Column, Entity, PrimaryColumn } from 'typeorm';
import { type_affiliation } from '../enum/eps-person.enum';

@Entity({name: 'eps_person'})
export class EpsPerson {
  @PrimaryColumn('uuid')
  id_person: string;
  @PrimaryColumn()
  id_eps: number;
  @Column()
  affiliation: type_affiliation;
}
