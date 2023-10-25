import { expect, it, describe } from 'vitest'
import { Arithmetic } from '../src/index';

const arithmetic = new Arithmetic();

describe('Arithmetic SDK', () => {

  it('add() correctly adds two numbers', () => {
    expect(arithmetic.add(3, 4)).toBe(7);
    expect(arithmetic.add(-3, 4)).toBe(1);
  });

  it('subtract() correctly subtracts two numbers', () => {
    expect(arithmetic.subtract(10, 5)).toBe(5);
    expect(arithmetic.subtract(-10, 5)).toBe(-15);
  });

  it('multiply() correctly multiplies two numbers', () => {
    expect(arithmetic.multiply(3, 4)).toBe(12);
    expect(arithmetic.multiply(-3, 4)).toBe(-12);
  });

  it('divide() correctly divides two numbers', () => {
    expect(arithmetic.divide(12, 4)).toBe(3);
  });

  it('divide() throws an error when dividing by zero', () => {
    expect(() => arithmetic.divide(12, 0)).toThrow('Division by zero is not allowed.');
  });

});

