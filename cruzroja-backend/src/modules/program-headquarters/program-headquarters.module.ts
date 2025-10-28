import { Module } from '@nestjs/common';
import { ProgramHeadquartersController } from './program-headquarters.controller';
import { ProgramHeadquartersService } from './program-headquarters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramHeadquarters } from './entity/program-headquarters.entity';
import { HeadquartersStatusModule } from '../headquarters-status/headquarters-status.module';
import { GroupStatusModule } from '../group-status/group-status.module';
import { ProgramStatusModule } from '../program-status/program-status.module';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramHeadquarters]),
    HeadquartersStatusModule,
    GroupStatusModule,
    ProgramStatusModule,
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [ProgramHeadquartersController],
  providers: [ProgramHeadquartersService],
  exports: [ProgramHeadquartersService],
})
export class ProgramHeadquartersModule {}
