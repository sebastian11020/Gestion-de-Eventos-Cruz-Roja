import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import {
  type_blood,
  type_document,
  type_gender,
  type_sex,
} from '../enum/person.enums';
import { Location } from '../../location/entity/location.entity';
import { Program } from '../../program/entity/program.entity';
import { Groups } from '../../group/entity/groups.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { Address } from '../dto/address.dto';
import { EmergencyContact } from '../dto/emergency.dto';
import { EpsPerson } from '../../eps-person/entity/eps-person.entity';

@Entity()
export class Person {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  type_document: type_document;
  @Column()
  document: string;
  @Column()
  name: string;
  @Column()
  last_name: string;
  @Column()
  email: string;
  @Column()
  sex: type_sex;
  @Column()
  gender: type_gender;
  @Column()
  license: number;
  @Column()
  phone: number;
  @Column('jsonb')
  emergency_contact: EmergencyContact;
  @Column()
  type_blood: type_blood;
  @Column()
  birth_date: Date;
  @Column()
  registration_date: Date;
  @Column()
  entry_date: Date;
  @Column('jsonb')
  address: Address;

  @ManyToOne(() => Location, (l) => l.persons)
  @JoinColumn({ name: 'id_location' })
  location: Location;
  @ManyToOne(() => Headquarters, (h) => h.persons)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
  @ManyToOne(() => Groups, (g) => g.persons)
  @JoinColumn({ name: 'id_group' })
  group: Groups;
  @ManyToOne(() => Program, (p) => p.persons)
  @JoinColumn({ name: 'id_program' })
  program: Program;
  @OneToMany(() => EpsPerson, (epsPerson) => epsPerson.person)
  epsPerson: EpsPerson[];
}
