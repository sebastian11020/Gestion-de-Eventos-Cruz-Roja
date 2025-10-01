import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Eps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
