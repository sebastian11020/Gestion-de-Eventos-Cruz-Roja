import { Module } from '@nestjs/common';
import { PersonStatusService } from './person-status.service';
import { PersonStatusController } from './person-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonStatus } from './entity/person-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonStatus])],
  providers: [PersonStatusService],
  controllers: [PersonStatusController],
  exports: [PersonStatusService],
})
export class PersonStatusModule {}
