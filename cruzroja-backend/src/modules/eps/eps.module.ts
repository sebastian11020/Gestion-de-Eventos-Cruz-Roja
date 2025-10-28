import { Module } from '@nestjs/common';
import { EpsService } from './eps.service';
import { EpsController } from './eps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eps } from './entity/eps.entity';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Eps]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [EpsService],
  controllers: [EpsController],
  exports: [EpsService],
})
export class EpsModule {}
