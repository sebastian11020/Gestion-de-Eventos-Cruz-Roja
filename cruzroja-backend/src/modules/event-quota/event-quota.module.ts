import { Module } from '@nestjs/common';
import { EventQuotaController } from './event-quota.controller';
import { EventQuotaService } from './event-quota.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventQuota } from './entity/event-quota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventQuota])],
  controllers: [EventQuotaController],
  providers: [EventQuotaService],
  exports: [EventQuotaService],
})
export class EventQuotaModule {}
