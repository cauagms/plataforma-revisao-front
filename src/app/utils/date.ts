const TIMEZONE_SUFFIX_REGEX = /(?:[zZ]|[+-]\d{2}:\d{2})$/;

export function parseApiUtcDate(value: string | null): Date | null {
  if (!value) return null;

  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const withTimezone = TIMEZONE_SUFFIX_REGEX.test(normalized) ? normalized : `${normalized}Z`;
  const parsed = new Date(withTimezone);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}
