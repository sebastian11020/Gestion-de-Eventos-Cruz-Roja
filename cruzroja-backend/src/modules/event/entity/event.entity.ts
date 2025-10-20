import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../../location/entity/location.entity';
import { Scope } from '../../scope/entity/scope.entity';
import { ClassificationEvent } from '../../classification_event/entity/classification-event';
import { EventFrame } from '../../event-frame/entity/event-frame';
import { Person } from '../../person/entity/person.entity';
import { Headquarters } from '../../headquarters/entity/headquarters.entity';
import { GroupHeadquarters } from '../../group-headquarters/entity/group-headquarters.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  start_date: Date;
  @Column()
  estimated_end_date: Date;
  @Column({ nullable: true })
  end_date: Date;
  @Column()
  max_volunteers: number;
  @Column()
  is_virtual: boolean;
  @Column()
  decree_1809_applies: boolean;
  @Column()
  street_address: string;
  @Column({ nullable: true })
  total_hours: number;
  @Column()
  is_private: boolean;
  @Column()
  is_adult: boolean;
  @ManyToOne(() => Location, (l) => l.events)
  @JoinColumn({ name: 'id_location' })
  location: Location;
  @ManyToOne(() => Scope, (s) => s.events)
  @JoinColumn({ name: 'id_scope' })
  scope: Scope;
  @ManyToOne(() => ClassificationEvent, (ce) => ce.events)
  @JoinColumn({ name: 'id_classification' })
  classificationEvent: ClassificationEvent;
  @ManyToOne(() => EventFrame, (ef) => ef.events)
  @JoinColumn({ name: 'id_event_frame' })
  eventFrame: EventFrame;
  @ManyToOne(() => Person, (person) => person.events)
  @JoinColumn({ name: 'id_coordinator' })
  person: Person;
  @ManyToOne(() => Headquarters, (h) => h.events)
  @JoinColumn({ name: 'id_headquarters' })
  headquarters: Headquarters;
  @ManyToOne(() => GroupHeadquarters, (gh) => gh.events, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_group' })
  groupHeadquarters: GroupHeadquarters;
}
