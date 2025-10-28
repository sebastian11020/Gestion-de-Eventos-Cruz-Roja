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
import { Address } from '../dto/address.dto';
import { EmergencyContact } from '../dto/emergency.dto';
import { EpsPerson } from '../../eps-person/entity/eps-person.entity';
import { PersonRole } from '../../person-role/entity/person-role.entity';
import { PersonStatus } from '../../person-status/entity/person-status.entity';
import { PersonSkill } from '../../person-skill/entity/person-skill.entity';
import { Event } from '../../event/entity/event.entity';
import { EventEnrollment } from '../../event-enrollment/entity/event-enrollment.entity';

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
  license: string;
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
  @OneToMany(() => EpsPerson, (epsPerson) => epsPerson.person)
  eps_person: EpsPerson[];
  @OneToMany(() => PersonRole, (rp) => rp.person)
  person_roles: PersonRole[];
  @OneToMany(() => PersonStatus, (personStatus) => personStatus.person)
  person_status: PersonStatus[];
  @OneToMany(() => PersonSkill, (personSkill) => personSkill.person)
  person_skills: PersonSkill[];
  @OneToMany(() => PersonSkill, (personSkill) => personSkill.person)
  events: Event[];
  @OneToMany(() => EventEnrollment, (e) => e.person)
  event_enrollment: EventEnrollment[];
}
