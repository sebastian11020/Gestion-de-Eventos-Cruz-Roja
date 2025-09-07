export const PhoneValidator = {
  normalize(raw: string): string {
    return raw.replace(/[\s()-]/g, '');
  },

  isValid(value: string): boolean {
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    return phoneRegex.test(value);
  },
};
