// Some of these tests are adapted from code samples included in MDN Web Docs after 2010.
// All code samples added to MDN Web Docs after 2010 in the public domain under CC0 
// (https://creativecommons.org/publicdomain/zero/1.0/). See 
// https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license#code_samples
// for details.

import { expect, test } from 'vitest';
import { clone, equals, ValueArray } from '../lib/main';

function expectIsClone(orig: unknown, copy: unknown): void {
  const isClone = equals(orig, copy) && orig != copy;
  if (!isClone) {
    console.log('not clone', orig, copy);
  }
  expect(isClone).toBeTruthy();
}

function expectValueEquals(lhs: unknown, rhs: unknown): void {
  const same = equals(lhs, rhs);
  if (!same) {
    console.log('not value equals', lhs, rhs);
  }
  expect(same).toBeTruthy();
}

function expectNotValueEquals(lhs: unknown, rhs: unknown): void {
  const different = equals(lhs, rhs);
  if (!different) {
    console.log('value equals', lhs, rhs);
  }
  expect(different).toBeFalsy();
}

test('Array.constructor', () => {
  expectValueEquals(new ValueArray(), new ValueArray());
  expectNotValueEquals(new ValueArray(), []);
  expectValueEquals(new ValueArray({ a: 1 }, { b: 2 }), new ValueArray({ a: 1 }, { b: 2 }));
  const arr = [{ a: 1 }, { b: 2 }];
  expectValueEquals(new ValueArray(...arr), new ValueArray({ a: 1 }, { b: 2 }));
  expectValueEquals(new ValueArray(1), new ValueArray(1));
  expectNotValueEquals(new ValueArray(1), new ValueArray(0));
  expectNotValueEquals(new ValueArray(1), new ValueArray([1]));
  expectValueEquals(new ValueArray(...['a', 'b']), new ValueArray('a', 'b'));
  // TODO: constructor without `new`

  // External clone
  const orig = new ValueArray(...arr);
  const copy = clone(orig);
  expectValueEquals(orig, orig);
  expectValueEquals(orig, copy);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
})

test('Array.from', () => {
  // External clone
  const arr = [{ a: 1 }, { b: 2 }];
  const orig = ValueArray.from(arr);
  expect(orig).toBeInstanceOf(ValueArray);
  const copy = clone(orig);
  expectValueEquals(orig, copy);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
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
  expect(orig).toBeInstanceOf(ValueArray);
  const copy = clone(orig);
  expectValueEquals(orig, copy);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
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
  expect(orig).toBeInstanceOf(ValueArray);
  const copy = clone(orig);
  expectValueEquals(orig, copy);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
})

// No Change
test('Array[Symbol.species]', () => {
  expect(ValueArray[Symbol.species]).toBe(ValueArray);
})

test('Array.at', () => {
  // External clone
  const valArr = new ValueArray({ a: 1 }, { b: 2 });
  const copy = clone(valArr.at(1));
  expectValueEquals(valArr[1], copy);
  expectIsClone(valArr[1], copy);
})

test('Array.concat', () => {
  // External clone
  const valArr1 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const valArr2 = new ValueArray({ c: 3 }, { d: 4 });
  const valArrConcat = valArr1.concat(clone(valArr2));
  const valArrExpect = new ValueArray({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
  expectValueEquals(valArrConcat, valArrExpect);
  expect(valArr1[0] === valArrConcat[0]).toBeTruthy();
  expectValueEquals(valArr2[0], valArrConcat[2]);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
test('Array.copyWithin', () => {
  // Primitive elements
  const array1 = new ValueArray('a', 'b', 'c', 'd', 'e');
  array1.copyWithin(0, 3, 4);
  expectValueEquals(array1, new ValueArray('d', 'b', 'c', 'd', 'e'));
  array1.copyWithin(1, 3);
  expectValueEquals(array1, new ValueArray('d', 'd', 'e', 'd', 'e'));

  const array2 = new ValueArray(1, 2, 3, 4, 5).copyWithin(2, 0);
  expectValueEquals(array2, new ValueArray(1, 2, 1, 2, 3));

  const array3 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3);
  expectValueEquals(array3, new ValueArray(4, 5, 3, 4, 5));

  const array4 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3, 4);
  expectValueEquals(array4, new ValueArray(4, 2, 3, 4, 5));

  const array5 = new ValueArray(1, 2, 3, 4, 5).copyWithin(-2, -3, -1);
  expectValueEquals(array5, new ValueArray(1, 2, 3, 3, 4));

  const array6 = new ValueArray(...[1, , 3]).copyWithin(2, 1, 2);
  expectValueEquals(array6, new ValueArray(...[1, , ,]));

  // Object elements
  const arrayA = new ValueArray({a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5});

  arrayA.copyWithin(0, 3, 4);
  const arrayB = new ValueArray({d: 4}, {b: 2}, {c: 3}, {d: 4}, {e: 5});
  expectValueEquals(arrayA, arrayB);

  arrayA.copyWithin(1, 3);
  const arrayC = new ValueArray({d: 4}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expectValueEquals(arrayA, arrayC);

  arrayA[0].d = 10;
  const arrayD = new ValueArray({d: 10}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expectValueEquals(arrayA, arrayD);
})

test('Array.entries', () => {
  // External clone
  const valArr = new ValueArray<object>({ a: 1 }, { b: 2 });
  const clones = [];
  for (const member of clone(valArr)) {
    clones.push(member);
  }
  expectIsClone(valArr[0], clones[0]);
  expectIsClone(valArr[1], clones[1]);
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
  expectValueEquals(array1, new ValueArray(1, 2, 0, 0));
  array1.fill(5, 1);
  expectValueEquals(array1, new ValueArray(1, 5, 5, 5));
  array1.fill(6);
  expectValueEquals(array1, new ValueArray(6, 6, 6, 6));

  expectValueEquals(new ValueArray(1, 2, 3).fill(4), new ValueArray(4, 4, 4));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1), new ValueArray(1, 4, 4));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1, 2), new ValueArray(1, 4, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1, 1), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 3, 3), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, -3, -2), new ValueArray(4, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, NaN, NaN), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 3, 5), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(3).fill(4), new ValueArray(4, 4, 4));

  const array2 = new ValueArray<ValueArray<number>>(3);
  for (let i = 0; i < array2.length; i++) {
    array2[i] = new ValueArray<number>(4).fill(1);
  }
  array2[0][0] = 10;
  expect(array2[0][0]).toEqual(10);
  expect(array2[1][0]).toEqual(1);
  expect(array2[2][0]).toEqual(1);

  expectValueEquals(
    new ValueArray(5).fill('value', 0), 
    new ValueArray('value', 'value', 'value', 'value', 'value')
  );

  // Object Elements
  const array3 = new ValueArray<{ hi?: string }>(3).fill({});
  array3[0].hi = 'hi';
  expectValueEquals(array3, new ValueArray({ hi: 'hi' }, { }, { }));
})

test('ValueArray.prototype.filter', () => {
  const valArr = new ValueArray('a', 'b', 'c')
  expect(valArr).toBeInstanceOf(ValueArray);
  const filterArr = valArr.filter((val) => val === 'b');
  expect(filterArr).toBeInstanceOf(ValueArray);
  expectValueEquals(filterArr, new ValueArray('b'));
})