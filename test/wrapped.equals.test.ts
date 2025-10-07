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
})