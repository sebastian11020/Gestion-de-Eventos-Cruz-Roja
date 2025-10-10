import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonRole } from '../../person-role/entity/person-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PersonRole, (pr) => pr.role)
  person_roles: PersonRole[];
}
