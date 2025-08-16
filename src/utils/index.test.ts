import { describe, it, expect } from 'vitest';
import { formatDate, slugify, truncate } from './index';

describe('Utility functions', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024');
  });

  it('should slugify text correctly', () => {
    const text = 'Hello World!';
    const slug = slugify(text);
    expect(slug).toBe('hello-world');
  });

  it('should truncate text correctly', () => {
    const text = 'This is a long text that should be truncated';
    const truncated = truncate(text, 10);
    expect(truncated).toBe('This is a...');
  });
});
