export const NameValidator = {
  normalize(raw: string): string {
    return raw.trim().replace(/\s+/g, ' ').toUpperCase();
  },
  isValid(value: string): boolean {
    return /^[A-ZÁÉÍÓÚÑ\s'-]{2,50}$/.test(value); // letras y algunos símbolos válidos
  },
};
