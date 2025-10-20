import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event/entity/event.entity';

@Entity()
export class Scope {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Event, (e) => e.scope)
  events: Event[];
}
