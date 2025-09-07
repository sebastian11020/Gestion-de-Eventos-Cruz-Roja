import { PhoneValidator } from './phone-validator';

export class PhoneVo {
  private constructor(public readonly value: string) {}

  static create(raw: string): PhoneVo {
    const normalized = PhoneValidator.normalize(raw);
    if (!PhoneValidator.isValid(normalized)) {
      throw new Error('Invalid phone number');
    }
    return new PhoneVo(normalized);
  }

  equals(other: PhoneVo): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}
