import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scope {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
