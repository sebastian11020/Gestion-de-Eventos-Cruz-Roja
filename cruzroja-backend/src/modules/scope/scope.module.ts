import { Module } from '@nestjs/common';
import { ScopeController } from './scope.controller';
import { ScopeService } from './scope.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scope } from './entity/scope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scope])],
  controllers: [ScopeController],
  providers: [ScopeService],
  exports: [ScopeService],
})
export class ScopeModule {}
