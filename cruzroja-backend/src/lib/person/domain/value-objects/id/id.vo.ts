import { IdPersonValidator } from './id-validator';

export class IdPerson {
  private constructor(public readonly value: string) {}

  static create(raw: string): IdPerson {
    const normalized = IdPersonValidator.normalize(raw);
    if (!IdPersonValidator.isValid(normalized)) {
      throw new Error('Invalid IdPerson: must be a UUID (36 chars).');
    }
    return new IdPerson(normalized);
  }

  equals(other: IdPerson): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
