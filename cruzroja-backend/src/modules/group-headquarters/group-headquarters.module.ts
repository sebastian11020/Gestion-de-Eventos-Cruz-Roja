import { Module } from '@nestjs/common';
import { GroupHeadquartersService } from './group-headquarters.service';
import { GroupHeadquartersController } from './group-headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { GroupStatusModule } from '../group-status/group-status.module';
import { HeadquartersStatusModule } from '../headquarters-status/headquarters-status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupHeadquarters]),
    HeadquartersStatusModule,
    GroupStatusModule,
  ],
  providers: [GroupHeadquartersService],
  controllers: [GroupHeadquartersController],
  exports: [GroupHeadquartersService],
})
export class GroupHeadquartersModule {}
