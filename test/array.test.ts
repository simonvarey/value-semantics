import { expect, test } from 'vitest';
import { clone, equals, ValueArray } from '../lib/main';

function isClone(orig: unknown, copy: unknown): boolean {
  return equals(orig, copy) && orig != copy;
}

// TODO: Constructor w/out `new`, single number argument
// External clone
test('Array.constructor', () => {
  const arr = [{ a: 1 }, { b: 2 }];
  const orig = new ValueArray(...arr);
  const copy = new ValueArray(...clone(arr)); // extra [] allocation
  expect(equals(orig, orig)).toBeTruthy();
  expect(equals(new ValueArray(), new ValueArray())).toBeTruthy();
  expect(equals(
    new ValueArray({ a: 1 }, { b: 2 }), 
    new ValueArray({ a: 1 }, { b: 2 }))
  ).toBeTruthy();
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
})

// External clone
test('Array.from', () => {
  const arr = [{ a: 1 }, { b: 2 }];
  const orig = ValueArray.from(arr);
  const copy = ValueArray.from(clone(arr)); // extra [] allocation
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
})

//Array.fromAsync

// Same
test('Array.isArray', () => {
  const arr = [{ a: 1 }, { b: 2 }];;
  const valArr = new ValueArray(...arr);
  expect(Array.isArray(valArr)).toBeTruthy();
  expect(ValueArray.isArray(valArr)).toBeTruthy();
})

// External clone
test('Array.of', () => {
  const arr = [{ a: 1 }, { b: 2 }];;
  const orig = ValueArray.of(...arr);
  const copy = ValueArray.of(...clone(arr)); // extra [] allocation
  expect(equals(orig, copy)).toBeTruthy();
  expect(isClone(orig, copy)).toBeTruthy();
})

// Same
test('Array[Symbol.species]', () => {
  expect(ValueArray[Symbol.species]).toBe(ValueArray);
})

// External clone
test('Array.at', () => {
  const valArr = new ValueArray({ a: 1 }, { b: 2 });
  const copy = clone(valArr.at(1));
  expect(equals({ b: 2 }, copy)).toBeTruthy();
  expect(isClone({ b: 2 }, copy)).toBeTruthy();
})

// External clone
test('Array.concat', () => {
  const valArr1 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const valArr2 = new ValueArray({ c: 3 }, { d: 4 });
  const valArrConcat = valArr1.concat(clone(valArr2)); // extra [] allocation
  const valArrExpect = new ValueArray({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
  expect(equals(valArrConcat, valArrExpect)).toBeTruthy();
  expect(isClone(valArrConcat, valArrExpect)).toBeTruthy();
})

// Array.copyWithin()
