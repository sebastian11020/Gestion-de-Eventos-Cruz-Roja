import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export function assert<T>(
  value: T | null | undefined,
  message = 'Datos invalidos',
): asserts value is NonNullable<T> {
  if (!value) throw new BadRequestException({ success: false, message });
}

export function assertFound<T>(
  value: T | null | undefined,
  message = 'No encontrado',
): asserts value is T {
  if (!value) throw new NotFoundException({ success: false, message });
}

export function conflict(message = 'Conflicto entre datos') {
  throw new ConflictException({ success: false, message });
}
