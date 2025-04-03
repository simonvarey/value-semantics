import { expect, test } from 'vitest';
import { clone, equals, ValueArray } from '../lib/main';

function isClone(orig: unknown, copy: unknown): boolean {
  return equals(orig, copy) && orig != copy;
}

test('Array.constructor', () => {
  const arr = [1, 2];
  const orig = new ValueArray(...arr);
  const copy = clone(new ValueArray(...arr)); // extra [] allocation
  expect(equals(orig, orig)).toBeTruthy();
  expect(equals(new ValueArray(), new ValueArray())).toBeTruthy();
  expect(equals(new ValueArray(1,2), new ValueArray(1,2))).toBeTruthy();
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
})
