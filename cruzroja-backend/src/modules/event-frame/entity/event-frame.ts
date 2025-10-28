import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event/entity/event.entity';

@Entity()
export class EventFrame {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Event, (e) => e.eventFrame)
  events: Event[];
}
