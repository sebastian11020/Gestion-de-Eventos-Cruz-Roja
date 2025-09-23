import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Groups } from '../../group/entity/groups.entity';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Groups, (group) => group.id)
  group: Groups;
}
