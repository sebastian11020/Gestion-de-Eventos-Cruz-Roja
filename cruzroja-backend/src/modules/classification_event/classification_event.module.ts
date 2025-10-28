import { Module } from '@nestjs/common';
import { ClassificationEventController } from './classification_event.controller';
import { ClassificationEventService } from './classification_event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationEvent } from './entity/classification-event';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassificationEvent]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [ClassificationEventController],
  providers: [ClassificationEventService],
  exports: [ClassificationEventService],
})
export class ClassificationEventModule {}
