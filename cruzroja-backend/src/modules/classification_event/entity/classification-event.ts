import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event/entity/event.entity';

@Entity()
export class ClassificationEvent {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Event, (e) => e.classificationEvent)
  events: Event[];
}
