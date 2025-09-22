import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { LocationModule } from './modules/location/location.module';
import { HeadquartersModule } from './modules/headquarters/headquarters.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
