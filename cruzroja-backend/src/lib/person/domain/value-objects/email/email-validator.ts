export const EmailValidator = {
  normalize(raw: string): string {
    return raw.trim().toLowerCase();
  },

  isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(value);
  },
};
