import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entity/location.entity';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
