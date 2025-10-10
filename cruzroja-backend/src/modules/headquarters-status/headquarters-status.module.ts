import { Module } from '@nestjs/common';
import { HeadquartersStatusController } from './headquarters-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeadquartersStatus } from './entity/headquarters-status.entity';
import { HeadquartersStatusService } from './headquarters-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HeadquartersStatus]),
    HeadquartersStatusModule,
  ],
  controllers: [HeadquartersStatusController],
  providers: [HeadquartersStatusService],
  exports: [HeadquartersStatusService],
})
export class HeadquartersStatusModule {}
