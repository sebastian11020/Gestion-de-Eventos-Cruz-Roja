import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { GlobalHttpExceptionFilter } from './common/filters/GlobalHttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const allowedOrigins = process.env.ALLOWED_ORIGINS;

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'apikey',
      'x-client-info',
      'x-supabase-authorization',
    ],
    credentials: true,
    maxAge: 86400,
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
