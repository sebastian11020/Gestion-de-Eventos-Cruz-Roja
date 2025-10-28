import { Module } from '@nestjs/common';
import { ScopeController } from './scope.controller';
import { ScopeService } from './scope.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scope } from './entity/scope.entity';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scope]),
    SupabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [ScopeController],
  providers: [ScopeService],
  exports: [ScopeService],
})
export class ScopeModule {}
