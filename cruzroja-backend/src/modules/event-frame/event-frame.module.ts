import { Module } from '@nestjs/common';
import { EventFrameController } from './event-frame.controller';
import { EventFrameService } from './event-frame.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventFrame } from './entity/event-frame';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventFrame]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [EventFrameController],
  providers: [EventFrameService],
  exports: [EventFrameService],
})
export class EventFrameModule {}
