import { Module } from '@nestjs/common';
import { EpsService } from './eps.service';
import { EpsController } from './eps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Eps } from './entity/eps.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Eps])],
  providers: [EpsService],
  controllers: [EpsController],
  exports: [EpsService],
})
export class EpsModule {}
