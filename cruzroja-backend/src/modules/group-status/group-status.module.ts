import { Module } from '@nestjs/common';
import { GroupStatusController } from './group-status.controller';
import { GroupStatusService } from './group-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupStatus } from './entity/group-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupStatus])],
  controllers: [GroupStatusController],
  providers: [GroupStatusService],
  exports: [GroupStatusService],
})
export class GroupStatusModule {}
