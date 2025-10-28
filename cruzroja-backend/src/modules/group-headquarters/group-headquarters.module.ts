import { Module } from '@nestjs/common';
import { GroupHeadquartersService } from './group-headquarters.service';
import { GroupHeadquartersController } from './group-headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { GroupStatusModule } from '../group-status/group-status.module';
import { HeadquartersStatusModule } from '../headquarters-status/headquarters-status.module';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupHeadquarters]),
    HeadquartersStatusModule,
    GroupStatusModule,
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [GroupHeadquartersService],
  controllers: [GroupHeadquartersController],
  exports: [GroupHeadquartersService],
})
export class GroupHeadquartersModule {}
