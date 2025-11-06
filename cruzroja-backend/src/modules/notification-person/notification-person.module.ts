import { Module } from '@nestjs/common';
import { NotificationPersonService } from './notification-person.service';

@Module({
  providers: [NotificationPersonService],
})
export class NotificationPersonModule {}
