export type DocumentValidator = 'CC' | 'TI' | 'CE' | 'PAS';
type Validator = {
  normalize: (raw: string) => string;
  isValid: (normalized: string) => boolean;
  format?: (normalized: string) => string;
};

const defaultNormalize = (raw: string) =>
  raw.trim().replace(/\s+/g, '').toUpperCase();

const onlyDigits = (s: string) => /^\d+$/.test(s);

export const documentValidators: Record<DocumentValidator, Validator> = {
  CC: {
    normalize: (r) => defaultNormalize(r).replace(/^0+/, ''),
    isValid: (n) => onlyDigits(n) && n.length >= 6 && n.length <= 10,
  },
  TI: {
    normalize: (r) => defaultNormalize(r).replace(/^0+/, ''),
    isValid: (n) => onlyDigits(n) && n.length >= 7 && n.length <= 11,
  },
  CE: {
    normalize: defaultNormalize,
    isValid: (n) => onlyDigits(n) && n.length >= 6 && n.length <= 12,
  },
  PAS: {
    normalize: defaultNormalize,
    isValid: (n) => /^[A-Z0-9]{5,15}$/.test(n),
  },
};
