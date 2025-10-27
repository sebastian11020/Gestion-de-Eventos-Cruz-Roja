import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Groups } from './entity/groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groups]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupModule {}
