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
  const same = equals(lhs, rhs);
  if (same) {
    console.log('value equals', lhs, rhs);
  }
  expect(same).toBeFalsy();
}

function va(...elements: any[]): ValueArray<any> {
  return new ValueArray(...elements);
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
  expect(ValueArray.from([NaN])[0]).toBe(NaN);
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
  const valArr3 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const arr = [{ c: 3 }, { d: 4 }];
  const arrConcat = valArr3.concat(clone(arr));
  expectValueEquals(arrConcat, valArrExpect);
  expect(valArr3[0] === arrConcat[0]).toBeTruthy();
  expectValueEquals(arr[0], arrConcat[2]);
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

test('Array.prototype.filter', () => {
  const valArr1 = new ValueArray('a', 'b', 'c');
  const filterArr1 = valArr1.filter((val) => val === 'b');
  expect(filterArr1).toBeInstanceOf(ValueArray);
  expectValueEquals(filterArr1, new ValueArray('b'));
  // external clone
  const valArr2 = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const filterArr2 = clone(valArr2.filter((val) => val.p === 'b'));
  expectIsClone(valArr2[1], filterArr2[0]);
})

test('Array.prototype.find', () => {
  const valArr1 = new ValueArray(1, 2, 3);
  const find1 = valArr1.find((val) => val % 2 === 0);
  expect(find1).toBe(2);
  // external clone
  const valArr2 = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const find2 = clone(valArr2.find((val) => val.p === 'b'));
  expectIsClone(valArr2[1], find2);
})

// No change
test('Array.prototype.findIndex', () => {
  const valArr = new ValueArray(1, 2, 3);
  const idx = valArr.findIndex((val) => val === 2);
  expect(idx).toBe(1);
})

test('Array.prototype.findLast', () => {
  const valArr1 = new ValueArray(1, 2, 3, 4);
  const find1 = valArr1.findLast((val) => val % 2 === 0);
  expect(find1).toBe(4);
  // external clone
  const valArr2 = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 });
  const find2 = clone(valArr2.findLast((val) => val.p % 2 === 0));
  expectIsClone(find2, { p: 4 });
})

// No change
test('Array.prototype.findLastIndex', () => {
  const valArr = new ValueArray(1, 2, 3, 4);
  const idx = valArr.findLastIndex((val) => val % 2 === 0);
  expect(idx).toBe(3);
})

test('Array.prototype.flat', () => {
  const valArr = va('a', 'b', va('c', 'd', va('e', 'f', va('g', 'h'))));
  const flat1 = valArr.flat();
  expectValueEquals(flat1, new ValueArray<any>('a', 'b', 'c', 'd', va('e', 'f', va('g', 'h'))));
  const flat2 = valArr.flat(2);
  expectValueEquals(flat2, new ValueArray<any>('a', 'b', 'c', 'd', 'e', 'f', va('g', 'h')));
  const flat3 = valArr.flat(Infinity);
  expectValueEquals(flat3, new ValueArray<any>('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'));
  const valArrWithArr = va('a', 'b', ['c', 'd', va('e', 'f', ['g', 'h'])]);
  const flat4 = valArrWithArr.flat(3);
  expectValueEquals(flat4, new ValueArray<any>('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'));
  const arrWithValArr = ['a', 'b', va('c', 'd', ['e', 'f', va('g', 'h')])];
  const flat5 = arrWithValArr.flat(3);
  expectValueEquals(flat5, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  // external clone
  const valArrObj = va({ p: 1 }, { p: 2 }, va({ p: 3 }, { p: 4 }, va({ p: 5 }, { p: 6 })));
  const flat6 = clone(valArrObj.flat());
  expectIsClone(valArrObj[0], flat6[0]);
  expectIsClone(valArrObj[2][2], flat6[4]);
})

test('Array.prototype.flatMap', () => {
  const valArr = new ValueArray(1, 2, 3);
  const fmArr = valArr.flatMap((val) => val % 2 === 0 ? val : [val, val]);
  expectValueEquals(fmArr, new ValueArray(1, 1, 2, 3, 3));
  const fmValArr = valArr.flatMap((val) => val % 2 === 0 ? val : new ValueArray(val, val));
  expectValueEquals(fmValArr, new ValueArray(1, 1, 2, 3, 3));
  // external clone
  const valArrObj = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const fmObj = clone(valArrObj.flatMap((val) => val.p === 'b' ? val : [val, val]));
  expectIsClone(valArrObj[0], fmObj[0]);
  expectIsClone(valArrObj[0], fmObj[1]);
})

// No change
test('Array.prototype.forEach', () => {
  let testIter = 0;
  const valArr = new ValueArray(1, 2, 3, 4);
  valArr.forEach((element) => { testIter += element; });
  expect(testIter).toBe(10);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
test('Array.prototype.includes', () => {
  // Primitive elements
  const pets = new ValueArray('cat', 'dog', 'bat');
  expect(pets.includes('cat')).toBeTruthy();
  expect(pets.includes('at')).toBeFalsy();

  expect(new ValueArray(1, 2, 3).includes(2)).toBeTruthy();
  expect(new ValueArray(1, 2, 3).includes(4)).toBeFalsy();
  expect(new ValueArray(1, 2, 3).includes(3, 3)).toBeFalsy();
  expect(new ValueArray(1, 2, 3).includes(3, -1)).toBeTruthy();
  expect(new ValueArray(1, 2, NaN).includes(NaN)).toBeTruthy();
  // @ts-expect-error
  expect(new ValueArray(1, 2, 3).includes('2')).toBeFalsy();
  
  const arr = new ValueArray('a', 'b', 'c');
  expect(arr.includes('c', 3)).toBeFalsy();
  expect(arr.includes('c', 100)).toBeFalsy();
  expect(arr.includes('a', -100)).toBeTruthy();
  expect(arr.includes('b', -100)).toBeTruthy();
  expect(arr.includes('c', -100)).toBeTruthy();
  expect(arr.includes('a', -2)).toBeFalsy();

  expect(new ValueArray(...[1, , 3]).includes(undefined)).toBeTruthy();

  // Object elements
  const objArr = new ValueArray({ a: 0 }, { b: 1 }, { c: 2 });
  expect(objArr.includes({ a: 0 })).toBeTruthy();
  expect(objArr.includes({ a: 1 })).toBeFalsy();
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
test('Array.prototype.indexOf', () => {
  // Primitive elements
  const animals = new ValueArray('ant', 'bison', 'camel', 'duck', 'bison');
  expect(animals.indexOf('bison')).toBe(1);
  expect(animals.indexOf('bison', 2)).toBe(4);
  expect(animals.indexOf('giraffe', 2)).toBe(-1);

  const array1 = new ValueArray(2, 9, 9);
  expect(array1.indexOf(2)).toBe(0);
  expect(array1.indexOf(7)).toBe(-1);
  expect(array1.indexOf(9, 2)).toBe(2);
  expect(array1.indexOf(2, -1)).toBe(-1);
  expect(array1.indexOf(2, -3)).toBe(0);

  const indices = [];
  const array2 = new ValueArray('a', 'b', 'a', 'c', 'a', 'd');
  const element = 'a';
  let idx = array2.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = array2.indexOf(element, idx + 1);
  }
  expect(indices).toStrictEqual([0, 2, 4])

  expect(ValueArray.from([1, , 3]).indexOf(undefined)).toBe(-1);
  expect(ValueArray.from([NaN]).indexOf(NaN)).toBe(-1);
  
  // Object elements
  expect(new ValueArray({a: 0}).indexOf({a: 0})).toBe(0);
})
