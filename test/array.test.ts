import { expect, test } from 'vitest';
import { clone, equals, ValueArray } from '../lib/main';

function isClone(orig: unknown, copy: unknown): boolean {
  return equals(orig, copy) && orig != copy;
}

test('Array.constructor', () => {
  const arr = [{ a: 1 }, { b: 2 }];
  expect(equals(new ValueArray(), new ValueArray())).toBeTruthy();
  expect(equals(
    new ValueArray({ a: 1 }, { b: 2 }), 
    new ValueArray({ a: 1 }, { b: 2 }))
  ).toBeTruthy();
  expect(equals(new ValueArray(...arr), new ValueArray({ a: 1 }, { b: 2 }))).toBeTruthy();
  expect(equals(new ValueArray(1), new ValueArray(1))).toBeTruthy();
  expect(equals(new ValueArray(1), new ValueArray(0))).toBeFalsy();
  expect(equals(new ValueArray(1), new ValueArray([1]))).toBeFalsy();
  expect(equals(new ValueArray(...['a', 'b']), new ValueArray('a', 'b'))).toBeTruthy();
  // TODO: constructor without `new`

  // External clone
  const orig = new ValueArray(...arr);
  const copy = clone(orig);
  expect(equals(orig, orig)).toBeTruthy();
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
  expect(isClone(orig[0], copy[0])).toBeTruthy();
})

test('Array.from', () => {
  // External clone
  const arr = [{ a: 1 }, { b: 2 }];
  const orig = ValueArray.from(arr);
  const copy = clone(orig);
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
  expect(isClone(orig[0], copy[0])).toBeTruthy();
})

test('Array.fromAsync', async () => {
  // External clone
  const asyncIterable = (async function* () {
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10 * i));
      yield { a: i };
    }
  })();
  const orig = await ValueArray.fromAsync(asyncIterable);
  const copy = clone(orig);
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
  expect(isClone(orig[0], copy[0])).toBeTruthy();
})

// No change
test('Array.isArray', () => {
  const arr = [{ a: 1 }, { b: 2 }];;
  const valArr = new ValueArray(...arr);
  expect(Array.isArray(valArr)).toBeTruthy();
  expect(ValueArray.isArray(valArr)).toBeTruthy();
})

test('Array.of', () => {
  // External clone
  const arr = [{ a: 1 }, { b: 2 }];;
  const orig = ValueArray.of(...arr);
  const copy = clone(orig);
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
  expect(isClone(orig[0], copy[0])).toBeTruthy();
})

// No Change
test('Array[Symbol.species]', () => {
  expect(ValueArray[Symbol.species]).toBe(ValueArray);
})

test('Array.at', () => {
  // External clone
  const valArr = new ValueArray({ a: 1 }, { b: 2 });
  const copy = clone(valArr.at(1));
  expect(equals(valArr[1], copy)).toBeTruthy();
  expect(isClone(valArr[1], copy)).toBeTruthy();
})

test('Array.concat', () => {
  // External clone
  const valArr1 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const valArr2 = new ValueArray({ c: 3 }, { d: 4 });
  const valArrConcat = clone(valArr1.concat(valArr2));
  const valArrExpect = new ValueArray({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
  expect(equals(valArrConcat, valArrExpect)).toBeTruthy();
  expect(isClone(valArr1[0], valArrConcat[0])).toBeTruthy();
  expect(isClone(valArr2[0], valArrConcat[2])).toBeTruthy();
})

// Array.copyWithin()
