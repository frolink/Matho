import { describe, expect, it } from 'vitest';
import { formatPi, initialsOf, truncate } from '../format';

describe('formatPi', () => {
  it('formats an amount with 6 decimals and the pi symbol', () => {
    expect(formatPi(12.5)).toBe('π 12.500000');
  });
});

describe('truncate', () => {
  it('returns the original string when shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends an ellipsis when longer than maxLength', () => {
    expect(truncate('hello world', 5)).toBe('hell…');
  });
});

describe('initialsOf', () => {
  it('builds initials from a two-word name', () => {
    expect(initialsOf('Jane Doe')).toBe('JD');
  });
});
