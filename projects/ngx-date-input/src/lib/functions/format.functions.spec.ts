import { padStart } from './format.functions';

describe('Forma function', () => {
  it('should format string', () => {
    const value = padStart('2', 2);
    expect(value).toBe('02');
  });

  it('should format number', () => {
    const value = padStart(2, 2);
    expect(value).toBe('02');
  });
});
