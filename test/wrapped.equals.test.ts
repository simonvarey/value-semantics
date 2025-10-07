import { expect, test } from 'vitest';
import { customize, equals } from '../lib/main';

test('equating wrapped booleans', () => {
  // Wrapped Booleans
  expect(equals(true, new Boolean(true))).toBeTruthy();
  expect(equals(new Boolean(true), true)).toBeTruthy();
  expect(equals(new Boolean(true), new Boolean(true))).toBeTruthy();

  // Boolean Subclass
  @customize.equals('ref')
  class BooleanSub extends Boolean { }

  const boolSub1 = new BooleanSub(false);
  const boolSub2 = new BooleanSub(false);
  expect(equals(boolSub1, boolSub2)).toBeFalsy();
  expect(equals(boolSub1, false)).toBeFalsy();
})

test('equating numbers', () => {
  // Wrapped Numbers
  expect(equals(1, new Number(1))).toBeTruthy();
  expect(equals(new Number(1), 1)).toBeTruthy();
  expect(equals(new Number(1), new Number(1))).toBeTruthy();
  expect(equals(new Number(NaN), new Number(NaN))).toBeTruthy();
  expect(equals(NaN, new Number(NaN))).toBeTruthy();
  expect(equals(new Number(NaN), NaN)).toBeTruthy();

  // Number Subclass
  @customize.equals('ref')
  class NumberSub extends Number { }

  const numSub1 = new NumberSub(0);
  const numSub2 = new NumberSub(0);
  expect(equals(numSub1, numSub2)).toBeFalsy();
  expect(equals(numSub1, 0)).toBeFalsy();
})