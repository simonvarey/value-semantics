import { expect, test } from 'vitest';
import { customize, equals } from '../lib/main';

test('equating wrapped booleans', () => {
  // Wrapped Booleans
  expect(equals(true, new Boolean(true))).toBeTruthy();
  expect(equals(new Boolean(true), true)).toBeTruthy();
  expect(equals(new Boolean(true), new Boolean(true))).toBeTruthy();

  // Boolean Subclass
  class BooleanSub extends Boolean { }
  const boolSub1 = new BooleanSub(false);
  const boolSub2 = new BooleanSub(false);
  const boolSub3 = new BooleanSub(true);
  expect(equals(boolSub1, boolSub1)).toBeTruthy();
  expect(equals(boolSub1, boolSub2)).toBeTruthy();
  expect(equals(boolSub1, boolSub3)).toBeFalsy();
  expect(equals(boolSub1, false)).toBeFalsy();
  expect(equals(false, boolSub1)).toBeFalsy();
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
  class NumberSub extends Number { }
  const numSub1 = new NumberSub(0);
  const numSub2 = new NumberSub(0);
  expect(equals(numSub1, numSub2)).toBeTruthy();
  expect(equals(numSub1, 0)).toBeFalsy();
})

test('equating string', () => {
  // Wrapped String
  expect(equals('a', new String('a'))).toBeTruthy();
  expect(equals(new String('a'), 'a')).toBeTruthy();
  expect(equals(new String('a'), new String('a'))).toBeTruthy();

  // String Subclass
  @customize.equals('ref')
  class StringSub extends String { }

  const stringSub1 = new StringSub('a');
  const stringSub2 = new StringSub('a');
  expect(equals(stringSub1, stringSub2)).toBeFalsy();
  expect(equals(stringSub1, 'a')).toBeFalsy();
})