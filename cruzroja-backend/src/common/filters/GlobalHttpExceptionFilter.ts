import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

type PostgresDriverError = {
  code?: string;
  detail?: string;
  table?: string;
  schema?: string;
  constraint?: string;
};

function normalizeMessage(input: unknown, fallback: string): string {
  if (typeof input === 'string' && input.trim().length > 0) return input;
  if (Array.isArray(input)) {
    const flat = input.map((m) => String(m ?? '').trim()).filter(Boolean);
    if (flat.length) return flat.join(' , ');
  }
  return fallback;
}

function mapPostgresError(code?: string): { status: number; message: string } {
  switch (code) {
    case '23505': // unique_violation
      return {
        status: HttpStatus.CONFLICT,
        message: 'Registro duplicado (violación de índice único).',
      };
    case '23503': // foreign_key_violation
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Violación de llave foránea (referencia inexistente).',
      };
    case '23502': // not_null_violation
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Campo requerido no puede ser nulo.',
      };
    case '23514': // check_violation
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Restricción de validación incumplida.',
      };
    case '22P02': // invalid_text_representation (p.ej. UUID inválido)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Formato de dato inválido.',
      };
    default:
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Error de base de datos.',
      };
  }
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      status = exception.getStatus();

      if (typeof payload === 'string') {
        message = payload;
      } else {
        const obj = payload as Record<string, any>;
        message = normalizeMessage(obj.message, message);
      }
    } else if (exception instanceof QueryFailedError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const driverError = ((exception as any)?.driverError ??
        {}) as PostgresDriverError;
      const code: string | undefined = driverError.code;
      const mapped = mapPostgresError(code);
      status = mapped.status;
      message = mapped.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    res.json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
