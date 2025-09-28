import { Module } from '@nestjs/common';
import { GroupHeadquartersService } from './group-headquarters.service';
import { GroupHeadquartersController } from './group-headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupHeadquarters } from './entity/group-headquarters.entity';
import { HeadquartersModule } from '../headquarters/headquarters.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupHeadquarters]), HeadquartersModule],
  providers: [GroupHeadquartersService],
  controllers: [GroupHeadquartersController],
  exports: [GroupHeadquartersService],
})
export class GroupHeadquartersModule {}
