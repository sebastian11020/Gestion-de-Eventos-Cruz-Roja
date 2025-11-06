import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotificationNewEvent(name_event: string): Promise<number> {
    let not = this.notificationRepository.create({
      description: `Se creo el evento ${name_event} , corre y aparto tu cupo`,
    });
    not = await this.notificationRepository.save(not);
    return not.id;
  }

  async createNotificationUpdateEvent(name_event): Promise<void> {
    const not = this.notificationRepository.create({
      description: `Se actualizo la informacion del evento ${name_event}`,
    });
    await this.notificationRepository.save(not);
  }
}
