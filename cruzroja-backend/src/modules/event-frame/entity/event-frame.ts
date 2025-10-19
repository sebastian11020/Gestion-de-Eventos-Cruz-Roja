import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventFrame {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
