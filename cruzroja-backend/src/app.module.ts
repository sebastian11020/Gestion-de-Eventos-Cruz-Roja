import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { LocationModule } from './modules/location/location.module';
import { HeadquartersModule } from './modules/headquarters/headquarters.module';
import { GroupModule } from './modules/group/group.module';
import { ProgramModule } from './modules/program/program.module';
import { ProgramHeadquartersModule } from './modules/program-headquarters/program-headquarters.module';
import { GroupHeadquartersModule } from './modules/group-headquarters/group-headquarters.module';
import { EpsModule } from './modules/eps/eps.module';
import { PersonModule } from './modules/person/person.module';
import { EpsPersonModule } from './modules/eps-person/eps-person.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    LocationModule,
    HeadquartersModule,
    GroupModule,
    ProgramModule,
    HeadquartersModule,
    GroupHeadquartersModule,
    ProgramHeadquartersModule,
    EpsModule,
    PersonModule,
    EpsPersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
