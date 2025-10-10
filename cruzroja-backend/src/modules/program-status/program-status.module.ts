import { Module } from '@nestjs/common';
import { ProgramStatusController } from './program-status.controller';
import { ProgramStatusService } from './program-status.service';
import { ProgramStatus } from './entity/program-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramStatus])],
  controllers: [ProgramStatusController],
  providers: [ProgramStatusService],
  exports: [ProgramStatusService],
})
export class ProgramStatusModule {}
