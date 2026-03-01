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
  // No elements
  expectValueEquals(new ValueArray(), new ValueArray());
  expectNotValueEquals(new ValueArray(), []);  
  expectValueEquals(new ValueArray(1), new ValueArray(1));
  expectNotValueEquals(new ValueArray(1), new ValueArray(0));

  const sparseArr = new ValueArray(3);
  expect(sparseArr.hasOwnProperty(0)).toBeFalsy();

  // Primitive elements
  expectNotValueEquals(new ValueArray(1), new ValueArray([1]));
  expectValueEquals(new ValueArray(...['a', 'b']), new ValueArray('a', 'b'));

  // Object elements
  expectValueEquals(new ValueArray({ a: 1 }, { b: 2 }), new ValueArray({ a: 1 }, { b: 2 }));
  expectValueEquals(new ValueArray(...[{ a: 1 }, { b: 2 }]), new ValueArray({ a: 1 }, { b: 2 }));

  // ValueArray constructor cannot be used without `new`
  // [] cannot be used as ValueArray constructor

  // External clone
  const orig = new ValueArray({ a: 1 }, { b: 2 });
  const copy = clone(orig);
  expectValueEquals(orig, orig);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
})

test('Array.from', () => {
  // Primitive elements
  const valArr = ValueArray.from(['a', 'b', 'c']);
  expect(valArr).toBeInstanceOf(ValueArray);
  expectValueEquals(valArr, new ValueArray('a', 'b', 'c'));

  expect(ValueArray.from([NaN])[0]).toBe(NaN);

  // Array.from cannot be used to create sparse arrays

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
  async function* asyncIterable(builder: (index: number) => any) {
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10 * i));
      yield builder(i);
    }
  }

  // Primitive elements
  const asyncIterableNum = asyncIterable((i) => i);
  const orig = await ValueArray.fromAsync(asyncIterableNum);
  expect(orig).toBeInstanceOf(ValueArray);
  expectValueEquals(orig, new ValueArray(0, 1, 2, 3, 4))
  const copy = clone(orig);
  expectValueEquals(orig, copy);
  expect(orig[0]).toBe(copy[0]);

  // External clone
  const asyncIterableObj = asyncIterable((i) => ({ a: i }));
  const origObj = await ValueArray.fromAsync(asyncIterableObj);
  expect(origObj).toBeInstanceOf(ValueArray);
  expectValueEquals(origObj, new ValueArray({ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }))
  const copyObj = clone(origObj);
  expectIsClone(origObj, copyObj);
  expectIsClone(origObj[0], copyObj[0]);
})

// No change
test('Array.isArray', () => {
  const valArr = new ValueArray({ a: 1 }, { b: 2 });
  expect(Array.isArray(valArr)).toBeTruthy();
  expect(ValueArray.isArray(valArr)).toBeTruthy();
})

test('Array.of', () => {
  // Primitive elements
  const valArr = ValueArray.from(['a', 'b', 'c']);
  expect(valArr).toBeInstanceOf(ValueArray);
  expectValueEquals(valArr, new ValueArray('a', 'b', 'c'));

  // External clone
  const orig = ValueArray.of({ a: 1 }, { b: 2 });
  expect(orig).toBeInstanceOf(ValueArray);
  const copy = clone(orig);
  expectIsClone(orig, copy);
  expectIsClone(orig[0], copy[0]);
})

// No Change
test('Array[Symbol.species]', () => {
  expect(ValueArray[Symbol.species]).toBe(ValueArray);
})

test('Array.at', () => {
  // Primitive elements
  const valArr = new ValueArray('a', 'b');
  expect(valArr.at(1)).toBe('b');

  // External clone
  const valArrObj = new ValueArray({ a: 1 }, { b: 2 });
  const elementObj = clone(valArrObj.at(1));
  expectIsClone(valArrObj[1], elementObj);
})

test('Array.concat', () => {
  // Primitive elements
  const valArr1 = new ValueArray(1, 2);
  const valArr2 = new ValueArray(3, 4);
  const arr = [5, 6];
  const valArrConcat = valArr1.concat(clone(valArr2)).concat(arr);
  expectValueEquals(valArrConcat, new ValueArray(1, 2, 3, 4, 5, 6));

  // External clone
  const valArrObj1 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const valArrObj2 = new ValueArray({ c: 3 }, { d: 4 });
  const valArrObjConcat = valArrObj1.concat(clone(valArrObj2));
  const valArrObjExpect = new ValueArray({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });
  expectValueEquals(valArrObjConcat, valArrObjExpect);
  expect(valArrObj1[0] === valArrObjConcat[0]).toBeTruthy();
  expectIsClone(valArrObj2[0], valArrObjConcat[2]);

  const valArrObj3 = new ValueArray<object>({ a: 1 }, { b: 2 });
  const arrObj = [{ c: 3 }, { d: 4 }];
  const arrObjConcat = valArrObj3.concat(clone(arrObj));
  expectValueEquals(arrObjConcat, valArrObjExpect);
  expect(valArrObj3[0] === arrObjConcat[0]).toBeTruthy();
  expectIsClone(arrObj[0], arrObjConcat[2]);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
test('ValueArray.copyWithin', () => {
  // Primitive elements
  const valArr1 = new ValueArray('a', 'b', 'c', 'd', 'e');
  valArr1.copyWithin(0, 3, 4);
  expectValueEquals(valArr1, new ValueArray('d', 'b', 'c', 'd', 'e'));
  valArr1.copyWithin(1, 3);
  expectValueEquals(valArr1, new ValueArray('d', 'd', 'e', 'd', 'e'));

  const valArr2 = new ValueArray(1, 2, 3, 4, 5).copyWithin(2, 0);
  expectValueEquals(valArr2, new ValueArray(1, 2, 1, 2, 3));

  const valArr3 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3);
  expectValueEquals(valArr3, new ValueArray(4, 5, 3, 4, 5));

  const valArr4 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 3, 4);
  expectValueEquals(valArr4, new ValueArray(4, 2, 3, 4, 5));

  const valArr5 = new ValueArray(1, 2, 3, 4, 5).copyWithin(-2, -3, -1);
  expectValueEquals(valArr5, new ValueArray(1, 2, 3, 3, 4));

  const valArrSparse = new ValueArray(3);
  valArrSparse[0] = 1;
  valArrSparse[2] = 3;
  const valArr6 = valArrSparse.copyWithin(2, 1, 2);
  const valArrSparseExpect = new ValueArray(3);
  valArrSparseExpect[0] = 1;
  expectValueEquals(valArr6, valArrSparseExpect);

  const valArr7 = new ValueArray(1, 2, 3, 4, 5).copyWithin(10, 0);
  expectValueEquals(valArr7, new ValueArray(1, 2, 3, 4, 5));

  const valArr8 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 10);
  expectValueEquals(valArr8, new ValueArray(1, 2, 3, 4, 5));

  const valArr9 = new ValueArray(1, 2, 3, 4, 5).copyWithin(0, 4, 1);
  expectValueEquals(valArr9, new ValueArray(1, 2, 3, 4, 5));

  // Object elements
  const valArrObj1 = new ValueArray({a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5});

  valArrObj1.copyWithin(0, 3, 4);
  const valArrObj2 = new ValueArray({d: 4}, {b: 2}, {c: 3}, {d: 4}, {e: 5});
  expectValueEquals(valArrObj1, valArrObj2);

  valArrObj1.copyWithin(1, 3);
  const valArrObj3 = new ValueArray({d: 4}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expectValueEquals(valArrObj1, valArrObj3);

  valArrObj1[0].d = 10;
  const valArrObj4 = new ValueArray({d: 10}, {d: 4}, {e: 5}, {d: 4}, {e: 5});
  expectValueEquals(valArrObj1, valArrObj4);
})

test('Array.entries', () => {
  // Primitive valies
  const valArr = new ValueArray<number>(1, 2);
  const entries = [];
  for (const member of clone(valArr).entries()) {
    entries.push(member);
  }
  expect(valArr[0]).equals(entries[0][1]);
  expect(valArr[1]).equals(entries[1][1]);

  // External clone
  const valArrObj = new ValueArray<object>({ a: 1 }, { b: 2 });
  const entriesObj = [];
  for (const member of clone(valArrObj).entries()) {
    entriesObj.push(member);
  }
  expectIsClone(valArrObj[0], entriesObj[0][1]);
  expectIsClone(valArrObj[1], entriesObj[1][1]);
})

// No change
test('Array.every', () => {
  expect(new ValueArray(1, 1, 1).every((member) => member === 1)).toBeTruthy();
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
test('ValueArray.fill', () => {
  // Primitive elements
  const valArr1 = new ValueArray(1, 2, 3, 4);
  valArr1.fill(0, 2, 4);
  expectValueEquals(valArr1, new ValueArray(1, 2, 0, 0));
  valArr1.fill(5, 1);
  expectValueEquals(valArr1, new ValueArray(1, 5, 5, 5));
  valArr1.fill(6);
  expectValueEquals(valArr1, new ValueArray(6, 6, 6, 6));

  expectValueEquals(new ValueArray(1, 2, 3).fill(4), new ValueArray(4, 4, 4));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1), new ValueArray(1, 4, 4));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1, 2), new ValueArray(1, 4, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 1, 1), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 3, 3), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, -3, -2), new ValueArray(4, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, NaN, NaN), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(1, 2, 3).fill(4, 3, 5), new ValueArray(1, 2, 3));
  expectValueEquals(new ValueArray(3).fill(4), new ValueArray(4, 4, 4));

  const valArr2 = new ValueArray<ValueArray<number>>(3);
  for (let i = 0; i < valArr2.length; i++) {
    valArr2[i] = new ValueArray<number>(4).fill(1);
  }
  valArr2[0][0] = 10;
  expect(valArr2[0][0]).toEqual(10);
  expect(valArr2[1][0]).toEqual(1);
  expect(valArr2[2][0]).toEqual(1);

  expectValueEquals(
    new ValueArray(5).fill('value', 0), 
    new ValueArray('value', 'value', 'value', 'value', 'value')
  );

  // Object Elements
  const valArrObj = new ValueArray<{ hi?: string }>(3).fill({});
  valArrObj[0].hi = 'hi';
  expectValueEquals(valArrObj, new ValueArray({ hi: 'hi' }, { }, { }));
})

test('Array.filter', () => {
  // Primitive values
  const valArr1 = new ValueArray('a', 'b', 'c');
  const filterArr1 = valArr1.filter((val) => val === 'b');
  expect(filterArr1).toBeInstanceOf(ValueArray);
  expectValueEquals(filterArr1, new ValueArray('b'));

  // External clone
  const valArr2 = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const filterArr2 = clone(valArr2.filter((val) => val.p === 'b'));
  expectIsClone(valArr2[1], filterArr2[0]);
})

test('Array.find', () => {
  // Primitive values
  const valArr1 = new ValueArray(1, 2, 3);
  const find1 = valArr1.find((val) => val % 2 === 0);
  expect(find1).toBe(2);

  // External clone
  const valArr2 = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const find2 = clone(valArr2.find((val) => val.p === 'b'));
  expectIsClone(valArr2[1], find2);
})

// No change
test('Array.findIndex', () => {
  const valArr = new ValueArray(1, 2, 3);
  const idx = valArr.findIndex((val) => val === 2);
  expect(idx).toBe(1);
})

test('Array.findLast', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3, 4);
  const find = valArr.findLast((val) => val % 2 === 0);
  expect(find).toBe(4);

  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 });
  const findObj = clone(valArrObj.findLast((val) => val.p % 2 === 0));
  expectIsClone(findObj, { p: 4 });
})

test('Array.findLastIndex', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3, 4);
  const idx = valArr.findLastIndex((val) => val % 2 === 0);
  expect(idx).toBe(3);

  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 });
  const findObj = clone(valArrObj.findLast((val) => val.p % 2 === 0));
  expectIsClone(findObj, { p: 4 });
})

test('Array.flat', () => {
  // Primitive values
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

  // External clone
  const valArrObj = va({ p: 1 }, { p: 2 }, va({ p: 3 }, { p: 4 }, va({ p: 5 }, { p: 6 })));
  const flat6 = clone(valArrObj.flat());
  expectIsClone(valArrObj[0], flat6[0]);
  expectIsClone(valArrObj[2][2], flat6[4]);
})

test('Array.flatMap', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  const fmArr = valArr.flatMap((val) => val % 2 === 0 ? val : [val, val]);
  expectValueEquals(fmArr, new ValueArray(1, 1, 2, 3, 3));
  const fmValArr = valArr.flatMap((val) => val % 2 === 0 ? val : new ValueArray(val, val));
  expectValueEquals(fmValArr, new ValueArray(1, 1, 2, 3, 3));

  // External clone
  const valArrObj = new ValueArray({ p: 'a' }, { p: 'b' }, { p: 'c' });
  const fmObj = clone(valArrObj.flatMap((val) => val.p === 'b' ? val : [val, val]));
  expectIsClone(valArrObj[0], fmObj[0]);
  expectIsClone(valArrObj[0], fmObj[1]);
})

// No change
test('Array.forEach', () => {
  let testIter = 0;
  const valArr = new ValueArray(1, 2, 3, 4);
  valArr.forEach((element) => { testIter += element; });
  expect(testIter).toBe(10);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
test('ValueArray.includes', () => {
  // Primitive elements
  const valArr1 = new ValueArray('cat', 'dog', 'bat');
  expect(valArr1.includes('cat')).toBeTruthy();
  expect(valArr1.includes('at')).toBeFalsy();

  expect(new ValueArray(1, 2, 3).includes(2)).toBeTruthy();
  expect(new ValueArray(1, 2, 3).includes(4)).toBeFalsy();
  expect(new ValueArray(1, 2, 3).includes(3, 3)).toBeFalsy();
  expect(new ValueArray(1, 2, 3).includes(3, -1)).toBeTruthy();
  expect(new ValueArray(1, 2, NaN).includes(NaN)).toBeTruthy();
  expect(new ValueArray<any>(1, 2, 3).includes('2')).toBeFalsy();
  
  const valArr2 = new ValueArray('a', 'b', 'c');
  expect(valArr2.includes('c', 3)).toBeFalsy();
  expect(valArr2.includes('c', 100)).toBeFalsy();
  expect(valArr2.includes('a', -100)).toBeTruthy();
  expect(valArr2.includes('b', -100)).toBeTruthy();
  expect(valArr2.includes('c', -100)).toBeTruthy();
  expect(valArr2.includes('a', -2)).toBeFalsy();

  const sparseArr = new ValueArray(3);
  sparseArr[0] = 1;
  sparseArr[2] = 3;
  expect(sparseArr.includes(undefined)).toBeTruthy();

  // Object elements
  const valArrObj = new ValueArray({ a: 0 }, { b: 1 }, { c: 2 });
  expect(valArrObj.includes({ a: 0 })).toBeTruthy();
  expect(valArrObj.includes({ a: 1 })).toBeFalsy();
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
test('ValueArray.indexOf', () => {
  // Primitive elements
  const valArr1 = new ValueArray('ant', 'bison', 'camel', 'duck', 'bison');
  expect(valArr1.indexOf('bison')).toBe(1);
  expect(valArr1.indexOf('bison', 2)).toBe(4);
  expect(valArr1.indexOf('giraffe', 2)).toBe(-1);

  const valArr2 = new ValueArray(2, 9, 9);
  expect(valArr2.indexOf(2)).toBe(0);
  expect(valArr2.indexOf(7)).toBe(-1);
  expect(valArr2.indexOf(9, 2)).toBe(2);
  expect(valArr2.indexOf(2, -1)).toBe(-1);
  expect(valArr2.indexOf(2, -3)).toBe(0);

  const indices = [];
  const valArr3 = new ValueArray('a', 'b', 'a', 'c', 'a', 'd');
  const element = 'a';
  let idx = valArr3.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = valArr3.indexOf(element, idx + 1);
  }
  expect(indices).toStrictEqual([0, 2, 4])

  const sparseArr = new ValueArray(3);
  sparseArr[0] = 1;
  sparseArr[2] = 3;
  expect(sparseArr.indexOf(undefined)).toBe(-1);

  expect(ValueArray.from([NaN]).indexOf(NaN)).toBe(-1);
  
  // Object elements
  expect(new ValueArray({a: 0}).indexOf({a: 0})).toBe(0);
})

// No change
test('Array.join', () => {
  const valArr = new ValueArray<any>('a', 1, undefined, { b: 2 });
  expect(valArr.join('/')).toBe('a/1//[object Object]');
})

// No change
test('Array.keys', () => {
  const valArr = new ValueArray<any>('a', 1, undefined, { b: 2 });
  expect([...valArr.keys()]).toEqual([0, 1, 2, 3]);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
test('ValueArray.lastIndexOf', () => {
  const valArr1 = new ValueArray('Dodo', 'Tiger', 'Penguin', 'Dodo');
  expect(valArr1.lastIndexOf('Dodo')).toBe(3);
  expect(valArr1.lastIndexOf('Tiger')).toBe(1);

  const valArr2 = new ValueArray(2, 5, 9, 2);
  expect(valArr2.lastIndexOf(2)).toBe(3);
  expect(valArr2.lastIndexOf(7)).toBe(-1);
  expect(valArr2.lastIndexOf(2, 3)).toBe(3);
  expect(valArr2.lastIndexOf(2, 2)).toBe(0);
  expect(valArr2.lastIndexOf(2, -2)).toBe(0);
  expect(valArr2.lastIndexOf(2, -1)).toBe(3);
  
  const indices = [];
  const valArr3 = new ValueArray('a', 'b', 'a', 'c', 'a', 'd');
  const element = 'a';
  let idx = valArr3.lastIndexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = idx > 0 ? valArr3.lastIndexOf(element, idx - 1) : -1;
  }
  expect(indices).toStrictEqual([4, 2, 0]);

  const sparseArr = new ValueArray(3);
  sparseArr[0] = 1;
  sparseArr[2] = 3;
  expect(sparseArr.lastIndexOf(undefined)).toBe(-1);

  expect(ValueArray.from([NaN]).lastIndexOf(NaN)).toBe(-1);
  
  // Object elements
  expect(new ValueArray({a: 0}).lastIndexOf({a: 0})).toBe(0);
})

test('Array.map', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  const map = valArr.map((val) => val + 1)
  expectValueEquals(map, new ValueArray(2, 3, 4));
  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 5 }, { p: 6 });
  const mapObj = valArrObj.map((obj) => clone(obj));
  expectIsClone(valArrObj, mapObj);
})

// No change
test('Array.pop', () => {
  const valArr = new ValueArray<any>('a', 1, undefined, { b: 2 });
  expect(valArr.pop()).toEqual({ b: 2 });
})

test('Array.push', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  valArr.push(4);
  expectValueEquals(valArr, new ValueArray(1, 2, 3, 4));
  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 });
  const lastObj = { p: 4 };
  valArrObj.push(clone(lastObj));
  expectValueEquals(valArrObj, new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }));
  expectIsClone(valArrObj[3], lastObj);
})

test('Array.reduce', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  const sum = valArr.reduce((acc, num) => acc + num, 0);
  expectValueEquals(sum, 6);
  // External clone
  const expectObj = { p: 3 };
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, expectObj);
  const largestObj = valArrObj.reduce((prev, obj) => prev.p > obj.p ? prev : clone(obj), { p: 0 });
  expectIsClone(expectObj, largestObj);
})

test('Array.reduceRight', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  const sum = valArr.reduceRight((acc, num) => acc + num, 0);
  expectValueEquals(sum, 6);
  // External clone
  const expectObj = { p: 3 };
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, expectObj);
  const largestObj = valArrObj.reduceRight((prev, obj) => prev.p > obj.p ? prev : clone(obj), { p: 0 });
  expectIsClone(expectObj, largestObj);
})

// No change
test('Array.reverse', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  valArr.reverse();
  expectValueEquals(valArr, new ValueArray(3, 2, 1));
  // Object values
  const lastObj = { p: 3 };
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, lastObj);
  const reversed = clone(valArrObj.reverse());
  expectValueEquals(valArrObj, new ValueArray({ p: 3 }, { p: 2 }, { p: 1 }));
  expect(valArrObj[0] === lastObj).toBeTruthy();
  expectIsClone(reversed[0], lastObj);
})

test('Array.shift', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3);
  const first = valArr.shift();
  expectValueEquals(first, 1);
  expectValueEquals(valArr, new ValueArray(2, 3));
  // External clone
  const firstObj = { p: 1 };
  const valArrObj = new ValueArray(firstObj, { p: 2 }, { p: 3 });
  const firstObjClone = clone(valArrObj.shift());
  expectIsClone(firstObjClone, firstObj);
  expectValueEquals(valArrObj, new ValueArray({ p: 2 }, { p: 3 }));
})

test('Array.slice', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3, 4, 5);
  const slice = valArr.slice(1, 3);
  expectValueEquals(slice, new ValueArray(2, 3));
  // External clone
  const secondObj = { p: 2 };
  const valArrObj = new ValueArray({ p: 1 }, secondObj, { p: 3 }, { p: 4 }, { p: 5 });
  const sliceObj = clone(valArrObj.slice(1, 3));
  expectValueEquals(sliceObj, new ValueArray({ p: 2 }, { p: 3 }));
  expectIsClone(sliceObj[0], secondObj);
})

test('Array.some', () => {
  // Primitive values
  const valArr = new ValueArray(1, 2, 3, 4);
  expect(valArr.some((val) => val == 2)).toBeTruthy();
  expect(valArr.some((val) => val == 5)).toBeFalsy();
  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 5 });
  const sliceObj = clone(valArrObj.slice(1, 3));
  expectValueEquals(sliceObj, new ValueArray({ p: 2 }, { p: 3 }));
  expectIsClone(sliceObj[0], { p: 2 });
})

// No change
test('Array.sort', () => {
  // Primitive values
  const valArr = new ValueArray(4, 2, 1, 3);
  valArr.sort();
  expectValueEquals(valArr, new ValueArray(1, 2, 3, 4));

  const valArrSparse = new ValueArray(5);
  valArrSparse[0] = 4;
  valArrSparse[2] = 2;
  valArrSparse[3] = 1;
  valArrSparse[4] = 3;
  valArrSparse.sort();
  const valArrSparseExpected = new ValueArray(5);
  valArrSparseExpected[0] = 1;
  valArrSparseExpected[1] = 2;
  valArrSparseExpected[2] = 3;
  valArrSparseExpected[3] = 4;
  expectValueEquals(valArrSparse, valArrSparseExpected);

  // Object values
  const valArrObj = new ValueArray({ p: 2 }, { p: 3 }, { p: 1 });
  valArrObj.sort((a, b) => a.p - b.p);
  expectValueEquals(valArrObj, new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }));
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
test('ValueArray.splice', () => {
  // Primitive elements
  const valArr = new ValueArray('Jan', 'March', 'April', 'June');
  valArr.splice(1, 0, 'Feb');
  expectValueEquals(valArr, new ValueArray('Jan', 'Feb', 'March', 'April', 'June'));
  valArr.splice(4, 1, 'May');
  expectValueEquals(valArr, new ValueArray('Jan', 'Feb', 'March', 'April', 'May'));

  const valArr0 = new ValueArray('angel', 'clown', 'mandarin', 'sturgeon');
  const valArrRemoved0 = valArr0.splice(2, 0, 'drum');
  expectValueEquals(valArr0, new ValueArray('angel', 'clown', 'drum', 'mandarin', 'sturgeon'));
  expectValueEquals(valArrRemoved0, new ValueArray());
  const valArr1 = new ValueArray('angel', 'clown', 'mandarin', 'sturgeon');
  const valArrRemoved1 = valArr1.splice(2, 0, 'drum', 'guitar');
  expectValueEquals(valArr1, new ValueArray('angel', 'clown', 'drum', 'guitar', 'mandarin', 'sturgeon'));
  expectValueEquals(valArrRemoved1, new ValueArray());
  const valArr2 = new ValueArray('clown', 'mandarin', 'sturgeon');
  const valArrRemoved2 = valArr2.splice(0, 0, 'angel');
  expectValueEquals(valArr2, new ValueArray('angel', 'clown', 'mandarin', 'sturgeon'));
  expectValueEquals(valArrRemoved2, new ValueArray());
  const valArr3 = new ValueArray('angel', 'clown', 'mandarin');
  const valArrRemoved3 = valArr3.splice(valArr3.length, 0, 'sturgeon');
  expectValueEquals(valArr3, new ValueArray('angel', 'clown', 'mandarin', 'sturgeon'));
  expectValueEquals(valArrRemoved3, new ValueArray());
  const valArr4 = new ValueArray('angel', 'clown', 'drum', 'mandarin', 'sturgeon');
  const valArrRemoved4 = valArr4.splice(3, 1);
  expectValueEquals(valArr4, new ValueArray('angel', 'clown', 'drum', 'sturgeon'));
  expectValueEquals(valArrRemoved4, new ValueArray('mandarin'));
  const valArr5 = new ValueArray('angel', 'clown', 'drum', 'sturgeon');
  const valArrRemoved5 = valArr5.splice(2, 1, 'trumpet');
  expectValueEquals(valArr5, new ValueArray('angel', 'clown', 'trumpet', 'sturgeon'));
  expectValueEquals(valArrRemoved5, new ValueArray('drum'));
  const valArr6 = new ValueArray('angel', 'clown', 'trumpet', 'sturgeon');
  const valArrRemoved6 = valArr6.splice(0, 2, 'parrot', 'anemone', 'blue');
  expectValueEquals(valArr6, new ValueArray('parrot', 'anemone', 'blue', 'trumpet', 'sturgeon'));
  expectValueEquals(valArrRemoved6, new ValueArray('angel', 'clown'));
  const valArr7 = new ValueArray('parrot', 'anemone', 'blue', 'trumpet', 'sturgeon');
  const valArrRemoved7 = valArr7.splice(2, 2);
  expectValueEquals(valArr7, new ValueArray('parrot', 'anemone','sturgeon'));
  expectValueEquals(valArrRemoved7, new ValueArray('blue', 'trumpet'));
  const valArr8 = new ValueArray('angel', 'clown', 'mandarin', 'sturgeon');
  const valArrRemoved8 = valArr8.splice(-2, 1);
  expectValueEquals(valArr8, new ValueArray('angel', 'clown', 'sturgeon'));
  expectValueEquals(valArrRemoved8, new ValueArray('mandarin'));
  const valArr9 = new ValueArray('angel', 'clown', 'mandarin', 'sturgeon');
  const valArrRemoved9 = valArr9.splice(2);
  expectValueEquals(valArr9, new ValueArray('angel', 'clown'));
  expectValueEquals(valArrRemoved9, new ValueArray('mandarin', 'sturgeon'));

  const sparseArr = new ValueArray(6);
  sparseArr[0] = 1;
  sparseArr[2] = 3;
  sparseArr[3] = 4;
  sparseArr[5] = 6;
  const sparseArrRemoved = sparseArr.splice(1, 2);
  const sparseArrExpect = new ValueArray(4);
  sparseArrExpect[0] = 1;
  sparseArrExpect[1] = 4;
  sparseArrExpect[3] = 6;
  expectValueEquals(sparseArr, sparseArrExpect);
  const sparseArrRemovedExpect = new ValueArray(2);
  sparseArrRemovedExpect[1] = 3;
  expectValueEquals(sparseArrRemoved, sparseArrRemovedExpect);

  // Object elements
  const originalElement = { a: 3 };
  const valArrObj = new ValueArray({ a: 1 }, { a: 2 }, originalElement, { a: 4 });
  const addedElement = { a: 5 }
  const valArrObjRemoved = valArrObj.splice(0, 2, addedElement, { a: 6 }, { a: 7 });
  expectValueEquals(valArrObj, new ValueArray({ a: 5 }, { a: 6 }, { a: 7 }, { a: 3 }, { a: 4 }));
  expectValueEquals(valArrObjRemoved, new ValueArray({ a: 1 }, { a: 2 }));
  expectIsClone(valArrObj[0], addedElement);
  expect(valArrObj[3]).toEqual(originalElement);
})

// No change
test('Array.toLocaleString', () => {
  const valArr = new ValueArray<any>('a', 1, undefined, { b: 2 });
  expect(valArr.toLocaleString()).toEqual('a,1,,[object Object]');
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed
test('ValueArray.toReversed', () => {
  // Primitive elements
  const valArr = new ValueArray(1, 2, 3);
  const reversed = valArr.toReversed();
  expectValueEquals(reversed, new ValueArray(3, 2, 1));
  expectValueEquals(valArr, new ValueArray(1, 2, 3));

  const valArrSparse0 = new ValueArray(3);
  valArrSparse0[0] = 1;
  valArrSparse0[2] = 3;
  expectValueEquals(valArrSparse0.toReversed(), new ValueArray(3, undefined, 1));
  const valArrSparseExpect0 = new ValueArray(3);
  valArrSparseExpect0[0] = 1;
  valArrSparseExpect0[2] = 3;
  expectIsClone(valArrSparse0, valArrSparseExpect0);
  const valArrSparse1 = new ValueArray(4);
  valArrSparse1[0] = 1;
  valArrSparse1[2] = 3;
  valArrSparse1[3] = 4;
  expectValueEquals(valArrSparse1.toReversed(), new ValueArray(4, 3, undefined, 1));
  const valArrSparseExpect1 = new ValueArray(4);
  valArrSparseExpect1[0] = 1;
  valArrSparseExpect1[2] = 3;
  valArrSparseExpect1[3] = 4;
  expectIsClone(valArrSparse1, valArrSparseExpect1);

  // Object elements
  const firstObj = { p: 1 }
  const valArrObj = new ValueArray(firstObj, { p: 2 }, { p: 3 });
  const reversedObj = clone(valArrObj.toReversed());
  expectValueEquals(reversedObj, new ValueArray({ p: 3 }, { p: 2 }, { p: 1 }));
  expectIsClone(reversedObj[2], firstObj);
  expectValueEquals(valArrObj, new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }));
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
test('ValueArray.toSorted', () => {
  // Primitive elements
  const valArr0 = new ValueArray('Mar', 'Jan', 'Feb', 'Dec');
  const valArrSorted0 = valArr0.toSorted();
  expectValueEquals(valArrSorted0, new ValueArray('Dec', 'Feb', 'Jan', 'Mar'));
  expectValueEquals(valArr0, new ValueArray('Mar', 'Jan', 'Feb', 'Dec'));

  const valArr = new ValueArray(1, 10, 21, 2);
  const sortedValArr = valArr.toSorted((a, b) => a - b);
  expectValueEquals(sortedValArr, new ValueArray(1, 2, 10, 21));
  expectValueEquals(valArr, new ValueArray(1, 10, 21, 2));
  
  const valArrSparse0 = new ValueArray(4);
  valArrSparse0[0] = 'a';
  valArrSparse0[1] = 'c';
  valArrSparse0[3] = 'b';
  const valArrSparseExpect0 = new ValueArray(4);
  valArrSparseExpect0[0] = 'a';
  valArrSparseExpect0[1] = 'c';
  valArrSparseExpect0[3] = 'b';
  expectValueEquals(valArrSparse0.toSorted(), new ValueArray('a', 'b', 'c', undefined));
  expectValueEquals(valArrSparse0, valArrSparseExpect0);
  const valArrSparse1 = new ValueArray(4);
  valArrSparse1[1] = undefined;
  valArrSparse1[2] = 'a';
  valArrSparse1[3] = 'b';
  const valArrSparseExpect1 = new ValueArray(4);
  valArrSparseExpect1[1] = undefined;
  valArrSparseExpect1[2] = 'a';
  valArrSparseExpect1[3] = 'b';
  expectValueEquals(valArrSparse1.toSorted(), new ValueArray('a', 'b', undefined, undefined));
  expectValueEquals(valArrSparse1, valArrSparseExpect1);

  // Object elements
  const firstObj = { p: 2 }
  const valArrObj = new ValueArray(firstObj, { p: 3 }, { p: 1 });
  const sortedObj = valArrObj.toSorted((a, b) => a.p - b.p);
  expectValueEquals(sortedObj, new ValueArray({ p: 1 }, { p: 2 }, { p: 3 }));
  expectIsClone(sortedObj[1], firstObj);
  expectValueEquals(valArrObj, new ValueArray({ p: 2 }, { p: 3 }, { p: 1 }));
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced
test('ValueArray.toSpliced', () => {
  // Primitive elements
  const valArr = new ValueArray('Jan', 'Mar', 'Apr', 'May');
  const splicedValArr0 = valArr.toSpliced(1, 0, 'Feb');
  expectValueEquals(splicedValArr0, new ValueArray('Jan', 'Feb', 'Mar', 'Apr', 'May'));
  const splicedValArr1 = splicedValArr0.toSpliced(2, 2);
  expectValueEquals(splicedValArr1, new ValueArray('Jan', 'Feb', 'May'));
  const splicedValArr2 = splicedValArr1.toSpliced(1, 1, 'Feb', 'Mar');
  expectValueEquals(splicedValArr2, new ValueArray('Jan', 'Feb', 'Mar', 'May'));
  expectValueEquals(valArr, new ValueArray('Jan', 'Mar', 'Apr', 'May'));

  const valArrSparse = new ValueArray(6);
  valArrSparse[0] = 1;
  valArrSparse[2] = 3;
  valArrSparse[3] = 4;
  valArrSparse[5] = 6; 
  const valArrSparseExpect = new ValueArray(6);
  valArrSparseExpect[0] = 1;
  valArrSparseExpect[2] = 3;
  valArrSparseExpect[3] = 4;
  valArrSparseExpect[5] = 6;
  expectValueEquals(valArrSparse.toSpliced(1, 2), new ValueArray(1, 4, undefined, 6));
  expectValueEquals(valArrSparse, valArrSparseExpect);

  // Object elements
  const originalElement = { a: 3 };
  const valArrObj = new ValueArray({ a: 1 }, { a: 2 }, originalElement, { a: 4 });
  const addedElement = { a: 5 }
  const valArrObjSpliced = valArrObj.toSpliced(0, 2, addedElement, { a: 6 }, { a: 7 });
  expectValueEquals(valArrObjSpliced, new ValueArray({ a: 5 }, { a: 6 }, { a: 7 }, { a: 3 }, { a: 4 }));
  expectIsClone(valArrObjSpliced[0], addedElement);
  expect(valArrObjSpliced[3]).toEqual(originalElement);
})

// No change
test('Array.toString', () => {
  const valArr = new ValueArray<any>('a', 1, undefined, { b: 2 });
  expect(valArr.toString()).toBe('a,1,,[object Object]');
})

test('Array.unshift', () => {
  // Primitive elements
  const valArr = new ValueArray(1, 2, 3);
  valArr.unshift(0);
  expectValueEquals(valArr, new ValueArray(0, 1, 2, 3));
  // External clone
  const valArrObj = new ValueArray({ p: 1 }, { p: 2 }, { p: 3 });
  const firstObj = { p: 0 };
  valArrObj.unshift(clone(firstObj));
  expectValueEquals(valArrObj, new ValueArray({ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }));
  expectIsClone(valArrObj[0], firstObj);
})

test('Array.values', () => {
  // Primitive elements
  const valArr = new ValueArray(1, 2);
  const values = [];
  for (const member of clone(valArr).values()) {
    values.push(member);
  }
  expect(valArr[0]).equals(values[0]);
  expect(valArr[1]).equals(values[1]);
  // External clone
  const valArrObj = new ValueArray({ a: 1 }, { b: 2 });
  const valuesObj = [];
  for (const member of clone(valArrObj).values()) {
    valuesObj.push(member);
  }
  expectIsClone(valArrObj[0], valuesObj[0]);
  expectIsClone(valArrObj[1], valuesObj[1]);
})

// Adapted from code samples in 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with
test('ValueArray.with', () => {
  // Primitive value
  const valArr = new ValueArray('a', 'b', 'c', 'd', 'e');
  const withArr = valArr.with(2, 'f');
  expectIsClone(withArr, new ValueArray('a', 'b', 'f', 'd', 'e'));

  const valArrSparse = new ValueArray(6);
  valArrSparse[0] = 1;
  valArrSparse[2] = 3;
  valArrSparse[3] = 4;
  valArrSparse[5] = 6; 
  expectValueEquals(valArrSparse.with(0, 2), new ValueArray(2, undefined, 3, 4, undefined, 6));

  // External clone
  const valArrObj = new ValueArray<any>({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 });
  const newObj = { f: 6 }
  const withArrObj = valArrObj.with(3, clone(newObj));
  expectIsClone(withArrObj[3], newObj);
})

test('Array.[Symbol.iterator]', () => {
  // Primitive value
  const valArr = new ValueArray(1, 2);
  const clones = [];
  for (const member of clone(valArr)) {
    clones.push(member);
  }
  expect(valArr[0]).equals(clones[0]);
  expect(valArr[1]).equals(clones[1]);
  // External clone
  const valArrObj = new ValueArray({ a: 1 }, { b: 2 });
  const clonesObj = [];
  for (const member of clone(valArrObj)) {
    clonesObj.push(member);
  }
  expectIsClone(valArrObj[0], clonesObj[0]);
  expectIsClone(valArrObj[1], clonesObj[1]);
})

// No change
test('Array.length', () => {
  const valArr = new ValueArray({ a: 1 }, { b: 2 });
  expect(valArr.length).toBe(2);
})

test('Array[Symbol.unscopables]', () => {
  const unscopables = new ValueArray()[Symbol.unscopables];
  expect(unscopables).toEqual({
    at: true,
    copyWithin: true,
    entries: true,
    fill: true,
    find: true,
    findIndex: true,
    findLast: true,
    findLastIndex: true,
    flat: true,
    flatMap: true,
    includes: true,
    keys: true,
    toReversed: true,
    toSorted: true,
    toSpliced: true,
    values: true
  });
})

test('Array[]', () => {
  // Primitive value
  const valArr = new ValueArray('a', 'b');
  expect(valArr[1]).toBe('b');
  valArr[2] = 'c';
  expect(valArr[2]).toBe('c');

  // External clone
  const valArrObj = new ValueArray<object>({ a: 1 }, { b: 2 });
  const readObj = clone(valArrObj[1]);
  expectIsClone(valArrObj[1], readObj);
  const writeObj = { c: 3 };
  valArrObj[2] = clone(writeObj);
  expectIsClone(valArrObj[2], writeObj);
})
