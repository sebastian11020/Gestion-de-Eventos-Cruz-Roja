export function NormalizeString(value: string): string {
  return value.trim().toUpperCase();
}

export function FormatNamesString(value: string): string {
  if (!value) return value;

  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
