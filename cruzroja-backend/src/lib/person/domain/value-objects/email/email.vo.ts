import { EmailValidator } from './email-validator';

export class EmailVo {
  private constructor(public readonly value: string) {}

  static create(raw: string): EmailVo {
    const normalized = EmailValidator.normalize(raw);
    if (!EmailValidator.isValid(normalized)) {
      throw new Error('Invalid email address');
    }
    return new EmailVo(normalized);
  }

  equals(other: EmailVo): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  toJSON() {
    return this.value;
  }
}
