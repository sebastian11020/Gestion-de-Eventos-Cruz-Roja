import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EpsPersonModule } from '../eps-person/eps-person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), EpsPersonModule],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
