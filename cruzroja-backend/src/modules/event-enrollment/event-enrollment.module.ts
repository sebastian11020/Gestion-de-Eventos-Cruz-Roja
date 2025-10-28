import { Module } from '@nestjs/common';
import { EventEnrollmentController } from './event-enrollment.controller';
import { EventEnrollmentService } from './event-enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEnrollment } from './entity/event-enrollment.entity';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEnrollment]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [EventEnrollmentController],
  providers: [EventEnrollmentService],
  exports: [EventEnrollmentService],
})
export class EventEnrollmentModule {}
