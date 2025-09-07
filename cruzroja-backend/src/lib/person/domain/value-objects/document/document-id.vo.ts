import { DocumentValidator, documentValidators } from './document-validator';

export class DocumentId {
  private constructor(
    public readonly type: DocumentValidator,
    private readonly value: string, // SIEMPRE normalizado
  ) {}

  /** Fábrica: aplica normalización + validación por tipo */
  static create(type: DocumentValidator, raw: string): DocumentId {
    const reg = documentValidators[type];
    if (!reg) throw new Error(`Unknown document type: ${type}`);

    const normalized = reg.normalize(raw);
    if (!reg.isValid(normalized)) {
      throw new Error(`Invalid ${type} document number`);
    }
    return new DocumentId(type, normalized);
  }

  /** Igualdad estructural entre VO */
  equals(other: DocumentId): boolean {
    return this.type === other.type && this.value === other.value;
  }

  /** Acceso controlado al número normalizado */
  get number(): string {
    return this.value;
  }

  /** Representación amigable (si definiste format) */
  toString(): string {
    const fmt = documentValidators[this.type].format;
    return fmt ? fmt(this.value) : this.value;
  }

  /** Serialización mínima y explícita (evita logs con PII accidental) */
  toJSON() {
    return { type: this.type, number: this.value };
  }
}
