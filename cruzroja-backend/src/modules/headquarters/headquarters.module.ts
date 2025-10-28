import { Module } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { HeadquartersController } from './headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headquarters } from './entity/headquarters.entity';
import { PersonModule } from '../person/person.module';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Headquarters]),
    PersonModule,
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [HeadquartersService],
  controllers: [HeadquartersController],
  exports: [HeadquartersService],
})
export class HeadquartersModule {}
