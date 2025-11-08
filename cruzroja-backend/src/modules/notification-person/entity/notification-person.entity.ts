import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Person } from '../../person/entity/person.entity';
import { Notification } from '../../notification/entity/notification';

@Entity()
export class NotificationPerson {
  @PrimaryColumn()
  id_notification: number;
  @PrimaryColumn()
  id_person: string;
  @Column()
  state: boolean;
  @ManyToOne(() => Person, (person) => person.notification_person)
  @JoinColumn({ name: 'id_person' })
  person: Person;
  @ManyToOne(() => Notification, (n) => n.notification_person)
  @JoinColumn({ name: 'id_notification' })
  notification: Notification;
}
