import { Module } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { HeadquartersController } from './headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Headquarters } from './entity/headquarters.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Headquarters]), LocationModule],
  providers: [HeadquartersService],
  controllers: [HeadquartersController],
  exports: [HeadquartersService],
})
export class HeadquartersModule {}
