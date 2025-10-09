import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { type_state } from '../enum/state-type.enum';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  type: type_state;
}
