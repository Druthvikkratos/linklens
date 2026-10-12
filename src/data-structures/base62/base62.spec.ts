import { Test, TestingModule } from '@nestjs/testing';
import { encode } from './base62';
import { decode } from './base62';

describe('encode', () => {
  it('should return the first alphabet character for zero', () => {
    expect(encode(0)).toBe('0');
  });

  it('should encode 61 has 1 character', () => {
    expect(encode(61)).toHaveLength(1);
  });

  it('should encode 62 has 2 characters', () => {
    expect(encode(62)).toHaveLength(2);
  });

  it('should throw error if it is negative number', () => {
    expect(() => encode(-1)).toThrow('Number should be a non-negative safe integer');
  });

  it('should throw error if it is decimal number', () => {
    expect(() => encode(1.5)).toThrow('Number should be a non-negative safe integer');
  });
});

describe('decode', () => {
  it('should encode and decode 1,000 different numbers correctly', () => {
    for (let i = 0; i < 1000; i++) {
      let encoded = encode(i);
      let decoded = decode(encoded);
      expect(decoded).toBe(i);
    }
  });

  it('should encode and decode the maximum safe integer', () => {
    let maxNumber = Number.MAX_SAFE_INTEGER;
    let encoded = encode(maxNumber);
    let decoded = decode(encoded);
    expect(decoded).toBe(maxNumber);
  });

  it('should throw error if it is invalid character', () => {
    expect(() => decode('ab-c')).toThrow('Invalid character cannot be decoded');
  });
});
