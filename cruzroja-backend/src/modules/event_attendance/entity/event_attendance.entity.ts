import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEnrollment } from '../../event-enrollment/entity/event-enrollment.entity';

@Entity()
export class EventAttendance {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  check_in: Date;
  @Column()
  check_out: Date;
  @Column()
  total_hours: number;
  @ManyToOne(() => EventEnrollment, (e) => e)
  @JoinColumn({ name: 'id_enrollment' })
  enrollment: EventEnrollment;
}
