import { Module } from '@nestjs/common';
import { EpsPersonService } from './eps-person.service';
import { EpsPersonController } from './eps-person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpsPerson } from './entity/eps-person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EpsPerson])],
  providers: [EpsPersonService],
  controllers: [EpsPersonController],
  exports: [EpsPersonService],
})
export class EpsPersonModule {}
