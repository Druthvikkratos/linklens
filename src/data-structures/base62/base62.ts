export const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encode(number: number) {
  let safeInteger = Number.isSafeInteger(number);
  if (!safeInteger || number < 0) {
    throw new Error('Number should be a non-negative safe integer');
  }
  if (number === 0) {
    return ALPHABET[0];
  }
  let result = '';
  while (number > 0) {
    let remainder = number % ALPHABET.length;
    result = ALPHABET[remainder] + result;
    number = Math.floor(number / ALPHABET.length);
  }
  return result;
}

export function decode(string: string): number {
  let result = 0;
  for (let i = 0; i < string.length; i++) {
    if (!ALPHABET.includes(string[i])) {
      throw new Error('Invalid character cannot be decoded');
    }
    let index = ALPHABET.indexOf(string[i])
    result = (result * ALPHABET.length) + index
  }
  return result
}
