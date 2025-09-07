// person/domain/validators/id-person.validator.ts
export const IdPersonValidator = {
  normalize(raw: string): string {
    // elimina espacios y lo pasa a minúsculas para mantener consistencia
    return raw.trim().toLowerCase();
  },

  isValid(value: string): boolean {
    // regex de UUID v1–v5 en formato canónico
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },
};
