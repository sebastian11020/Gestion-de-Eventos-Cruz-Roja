import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationPerson } from '../../notification-person/entity/notification-person.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @OneToMany(() => NotificationPerson, (np) => np.id_notification)
  notification_person: NotificationPerson[];
}
