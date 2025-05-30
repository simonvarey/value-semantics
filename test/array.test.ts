// Some of these tests are adapted from code samples included in MDN Web Docs after 2010.
// All code samples added to MDN Web Docs after 2010 in the public domain under CC0 
// (https://creativecommons.org/publicdomain/zero/1.0/). See 
// https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license#code_samples
// for details.

import { expect, test } from 'vitest';
import { clone, equals, ValueArray } from '../lib/main';

function isClone(orig: unknown, copy: unknown): boolean {
  return equals(orig, copy) && orig != copy;
}

test('Array.constructor', () => {
  expect(equals(new ValueArray(), new ValueArray())).toBeTruthy();
  expect(equals(new ValueArray(), [])).toBeFalsy();
  expect(equals(
    new ValueArray({ a: 1 }, { b: 2 }), 
    new ValueArray({ a: 1 }, { b: 2 }))
  ).toBeTruthy();
  const arr = [{ a: 1 }, { b: 2 }];
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
  expect(orig instanceof ValueArray).toBeTruthy();
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
  expect(orig instanceof ValueArray).toBeTruthy();
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
  expect(orig instanceof ValueArray).toBeTruthy();
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
  const valArrConcat = valArr1.concat(clone(valArr2));
  const valArrExpect = new ValueArray({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
  expect(equals(valArrConcat, valArrExpect)).toBeTruthy();
  expect(valArr1[0] === valArrConcat[0]).toBeTruthy();
  expect(isClone(valArr2[0], valArrConcat[2])).toBeTruthy();
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
test('Array.copyWithin', () => {
  // Primitive elements
  const array1 = new ValueArray('a', 'b', 'c', 'd', 'e');
  array1.copyWithin(0, 3, 4);
  expect(equals(array1, new ValueArray('d', 'b', 'c', 'd', 'e'))).toBeTruthy();
  array1.copyWithin(1, 3);
  expect(equals(array1, new ValueArray('d', 'd', 'e', 'd', 'e'))).toBeTruthy();

  const array2 = new ValueArray(1, 2, 3, 4, 5).copyWithin(2, 0);
  expect(equals(array2, new ValueArray(1, 2, 1, 2, 3))).toBeTruthy();

  const array3 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3);
  expect(equals(array3, new ValueArray(4, 5, 3, 4, 5))).toBeTruthy();

  const array4 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3, 4);
  expect(equals(array4, new ValueArray(4, 2, 3, 4, 5))).toBeTruthy();

  const array5 = new ValueArray(1, 2, 3, 4, 5).copyWithin(-2, -3, -1);
  expect(equals(array5, new ValueArray(1, 2, 3, 3, 4))).toBeTruthy();

  const array6 = new ValueArray(...[1, , 3]).copyWithin(2, 1, 2);
  expect(equals(array6, new ValueArray(...[1, , ,]))).toBeTruthy();

  // Object elements
  const arrayA = new ValueArray({a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5});

  arrayA.copyWithin(0, 3, 4);
  const arrayB = new ValueArray({d: 4}, {b: 2}, {c: 3}, {d: 4}, {e: 5});
  expect(equals(arrayA, arrayB)).toBeTruthy();

  arrayA.copyWithin(1, 3);
  const arrayC = new ValueArray({d: 4}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expect(equals(arrayA, arrayC)).toBeTruthy();

  arrayA[0].d = 10;
  const arrayD = new ValueArray({d: 10}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expect(equals(arrayA, arrayD)).toBeTruthy();
})

test('Array.entries', () => {
  // External clone
  const valArr = new ValueArray<object>({ a: 1 }, { b: 2 });
  const clones = [];
  for (const member of clone(valArr)) {
    clones.push(member);
  }
  expect(isClone(valArr[0], clones[0])).toBeTruthy();
  expect(isClone(valArr[1], clones[1])).toBeTruthy();
})

// No change
test('Array.every', () => {
  expect(new ValueArray(1, 1, 1).every((member) => member === 1)).toBeTruthy();
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
test('Array.fill', () => {
  // Primitive elements
  const array1 = new ValueArray(1, 2, 3, 4);
  array1.fill(0, 2, 4);
  expect(equals(array1, new ValueArray(1, 2, 0, 0)));
  array1.fill(5, 1);
  expect(equals(array1, new ValueArray(1, 5, 5, 5)));
  array1.fill(6);
  expect(equals(array1, new ValueArray(6, 6, 6, 6)));

  expect(equals(new ValueArray(1, 2, 3).fill(4), new ValueArray(4, 4, 4)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, 1), new ValueArray(1, 4, 4)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, 1, 2), new ValueArray(1, 4, 3)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, 1, 1), new ValueArray(1, 2, 3)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, 3, 3), new ValueArray(1, 2, 3)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, -3, -2), new ValueArray(4, 2, 3)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, NaN, NaN), new ValueArray(1, 2, 3)));
  expect(equals(new ValueArray(1, 2, 3).fill(4, 3, 5), new ValueArray(1, 2, 3)));
  expect(equals(new ValueArray(3).fill(4), new ValueArray(4, 4, 4)));

  const array2 = new ValueArray<ValueArray<number>>(3);
  for (let i = 0; i < array2.length; i++) {
    array2[i] = new ValueArray<number>(4).fill(1);
  }
  array2[0][0] = 10;
  expect(array2[0][0]).toEqual(10);
  expect(array2[1][0]).toEqual(1);
  expect(array2[2][0]).toEqual(1);

  expect(equals(new ValueArray(3).fill('value', 0), new ValueArray('value', 'value', 'value', 'value', 'value')));

  // Object Elements
  const array3 = new ValueArray<{ hi?: string }>(3).fill({});
  array3[0].hi = 'hi';
  expect(equals(array3, new ValueArray({ hi: 'hi' }, { }, { })));
})