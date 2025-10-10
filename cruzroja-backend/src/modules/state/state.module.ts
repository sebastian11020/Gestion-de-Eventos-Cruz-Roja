import { Module } from '@nestjs/common';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entity/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
