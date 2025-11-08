import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationPersonService } from './notification-person.service';
import { UserId } from '../../common/decorators/user.decorator';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';
import { GetNotificationPersonDTO } from './dto/get-notification-person.dto';
import { ReadNotificationDto } from './dto/read-notification.dto';

@Controller('notification-person')
@UseGuards(SupabaseAuthGuard)
export class NotificationPersonController {
  constructor(
    private readonly notificationPersonService: NotificationPersonService,
  ) {}

  @Get('/all')
  async getAll(@UserId() userId: string): Promise<GetNotificationPersonDTO[]> {
    return this.notificationPersonService.findAll(userId);
  }

  @Post('/read')
  async read(
    @UserId() userId: string,
    @Body() readNotification: ReadNotificationDto,
  ) {
    return await this.notificationPersonService.readNotification(
      userId,
      readNotification,
    );
  }
}
