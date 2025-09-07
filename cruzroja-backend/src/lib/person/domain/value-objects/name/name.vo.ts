import { NameValidator } from './name-validator';

export class FullName {
  private constructor(
    private readonly firstName: string,
    private readonly lastName: string,
  ) {}

  static create(first: string, last: string): FullName {
    const f = NameValidator.normalize(first);
    const l = NameValidator.normalize(last);
    if (!NameValidator.isValid(f)) throw new Error('Invalid first name');
    if (!NameValidator.isValid(l)) throw new Error('Invalid last name');
    return new FullName(f, l);
  }
  toPersistence() {
    return { firstName: this.firstName, lastName: this.lastName };
  }
  toDisplay() {
    return {
      firstName: FullName.capitalizeWords(this.firstName),
      lastName: FullName.capitalizeWords(this.lastName),
      full: `${FullName.capitalizeWords(this.firstName)} ${FullName.capitalizeWords(this.lastName)}`,
    };
  }

  private static capitalizeWords(s: string): string {
    return s.toLowerCase().replace(/\b\p{L}/gu, (m) => m.toUpperCase()); // capitaliza cada palabra (soporta acentos)
  }
}
