import { CURRENCY } from './constants';

/**
 * Format a numeric amount as a Pi-denominated currency string.
 * e.g. formatPi(12.5) -> "π 12.500000"
 */
export function formatPi(amount: number): string {
  return `π ${amount.toFixed(CURRENCY.DECIMALS)}`;
}

/**
 * Truncate a string to a max length, appending an ellipsis when truncated.
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/**
 * Build initials from a display name, e.g. "Jane Doe" -> "JD".
 */
export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
