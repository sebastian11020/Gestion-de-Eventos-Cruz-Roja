import { Module } from '@nestjs/common';
import { NotificationPersonService } from './notification-person.service';
import { NotificationPersonController } from './notification-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPerson } from './entity/notification-person.entity';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPerson]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [NotificationPersonService],
  controllers: [NotificationPersonController],
  exports: [NotificationPersonService],
})
export class NotificationPersonModule {}
