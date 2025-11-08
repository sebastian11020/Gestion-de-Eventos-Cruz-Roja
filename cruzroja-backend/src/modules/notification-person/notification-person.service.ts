import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPerson } from './entity/notification-person.entity';
import { Repository } from 'typeorm';
import { GetNotificationPersonDTO } from './dto/get-notification-person.dto';
import { FormatNamesString } from '../../common/utils/string.utils';
import { ReadNotificationDto } from './dto/read-notification.dto';

@Injectable()
export class NotificationPersonService {
  constructor(
    @InjectRepository(NotificationPerson)
    private notificationRepository: Repository<NotificationPerson>,
  ) {}

  async createNotificationPerson(
    id_persons: string[],
    id_notification: number,
  ): Promise<void> {
    for (const id_person of id_persons) {
      console.log(id_person);
      await this.notificationRepository.save({
        id_notification: id_notification,
        id_person: id_person,
      });
    }
  }

  async findAll(user_id: string): Promise<GetNotificationPersonDTO[]> {
    const notification = await this.notificationRepository.find({
      where: {
        id_person: user_id,
        state: true,
      },
      relations: {
        notification: true,
      },
    });
    return notification.map((n) => {
      const dto = new GetNotificationPersonDTO();
      dto.description = FormatNamesString(n.notification.description);
      dto.id = String(n.id_notification);
      return dto;
    });
  }

  async readNotification(
    user_id: string,
    notifications: ReadNotificationDto,
  ): Promise<void> {
    const n = notifications.notifications;
    if (!n.length) return;

    await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ state: false })
      .where('id_person = :user_id', { user_id })
      .andWhere('id IN (:...notifications)', { n })
      .execute();
  }
}
