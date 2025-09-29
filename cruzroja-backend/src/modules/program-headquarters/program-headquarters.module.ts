import { Module } from '@nestjs/common';
import { ProgramHeadquartersController } from './program-headquarters.controller';
import { ProgramHeadquartersService } from './program-headquarters.service';
import { HeadquartersModule } from '../headquarters/headquarters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramHeadquarters } from './entity/program-headquarters.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramHeadquarters]),
    HeadquartersModule,
  ],
  controllers: [ProgramHeadquartersController],
  providers: [ProgramHeadquartersService],
  exports: [ProgramHeadquartersService],
})
export class ProgramHeadquartersModule {}
