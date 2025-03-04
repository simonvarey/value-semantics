import { expect, test } from 'vitest'
import { customize, equals } from '../lib/main'

// * Primitives *

test('equate nulls', () => {
  expect(equals(null, null)).toBeTruthy();
})

test('equate null and number', () => {
  expect(equals(null, 1)).toBeFalsy();
  expect(equals(1, null)).toBeFalsy();
})

test('equate numbers', () => {
  expect(equals(1, 1)).toBeTruthy();
  expect(equals(1, 2)).toBeFalsy();
  expect(equals(3, 1)).toBeFalsy();
  expect(equals(NaN, NaN)).toBeTruthy();
  expect(equals(1, NaN)).toBeFalsy();
  expect(equals(NaN, 1)).toBeFalsy();
})

test('equate strings', () => {
  expect(equals('a', 'a')).toBeTruthy();
  expect(equals('b', 'c')).toBeFalsy();
})

test('equate empty object and null', () => {
  expect(equals({}, null)).toBeFalsy();
  expect(equals(null, {})).toBeFalsy();
})

test('equate arrays', () => {
  expect(equals([1, 'a'], [1, 'a'])).toBeTruthy();
  expect(equals([1, 'a'], [1])).toBeFalsy();
})

test('equate arrays and numbers', () => {
  expect(equals([1, 'a'], 1)).toBeFalsy();
})

test('equate array and empty object', () => {
  expect(equals([1, 'a'], {})).toBeFalsy();
})

test('equate function with itself', () => {
  const func = function (param: number): number { return param; };
  expect(equals(func, func)).toBeTruthy();
})

// * Objects *

// Object Literals

test('object literal equals object literal', () => {
  expect(equals({ a: 1 }, { a: 1 })).toBeTruthy();
})

test('object literal equals null prototype object', () => {
  expect(equals({ a: 1 }, Object.create(null))).toBeFalsy();
})

test('equating different object literals', () => {
  expect(equals({ a: 1 }, { a: 2 })).toBeFalsy();
  expect(equals({ a: 1, b: 2 }, { a: 2 })).toBeFalsy();
})

test('null prototype object equals null prototype object', () => {
  expect(equals(Object.create(null), Object.create(null))).toBeTruthy();
})

// Builtins

test('equating sets', () => {
  const set1 = new Set([1, 'a']);
  const set2 = new Set([1, 'a']);
  const set3 = new Set([2, 'b']);
  const set4 = new Set([1, 'a', 2, 'b']);
  expect(equals(set1, set2)).toBeTruthy();
  expect(equals(set1, set3)).toBeFalsy();
  expect(equals(set1, 0)).toBeFalsy();
  expect(equals(set1, {})).toBeFalsy();
  expect(equals(set1, set4)).toBeFalsy();
})

test('equating maps', () => {
  const map1 = new Map([[1, 'a']]);
  const map2 = new Map([[1, 'a']]);
  const map3 = new Map([[1, 'a'], [2, 'b']]);
  const map4 = new Map([[1, 'a'], [2, 'c']]);
  const map5 = new Map([[3, 'd'], [2, 'c']]);
  expect(equals(map1, map2)).toBeTruthy();
  expect(equals(map1, map3)).toBeFalsy();
  expect(equals(map1, 0)).toBeFalsy();
  expect(equals(map1, {})).toBeFalsy();
  expect(equals(map4, map3)).toBeFalsy();
  expect(equals(map5, map3)).toBeFalsy();
})

test('equating regexps', () => {
  const re1 = /ab/;
  const re2 = /ab/;
  const re3 = /abc/;
  const re4 = /ab/g;
  expect(equals(re1, re2)).toBeTruthy();
  expect(equals(re1, re3)).toBeFalsy();
  expect(equals(re1, re4)).toBeFalsy();
  expect(equals(re1, 0)).toBeFalsy();
  expect(equals(re1, {})).toBeFalsy();
})

test('equating dates', () => {
  const date1 = new Date(2000, 0, 1);
  const date2 = new Date(2000, 0, 1);
  const date3 = new Date(2001, 0, 1);
  expect(equals(date1, date2)).toBeTruthy();
  expect(equals(date1, date3)).toBeFalsy();
  expect(equals(date1, 0)).toBeFalsy();
  expect(equals(date1, {})).toBeFalsy();
})

test('equating weakrefs', () => {
  const target1 = { a: 1 };
  const ref1 = new WeakRef(target1);
  const target2 = { a: 1 };
  const ref2 = new WeakRef(target2);
  const target3 = { b: 2 };
  const ref3 = new WeakRef(target3);
  expect(equals(ref1, ref2)).toBeTruthy();
  expect(equals(ref1, ref3)).toBeFalsy();
  expect(equals(ref1, 0)).toBeFalsy();
  expect(equals(ref1, {})).toBeFalsy();
  // Dummy tests to keeps targets alive
  expect(ref1.deref()!.a).toBe(1);
  expect(ref2.deref()!.a).toBe(1);
  expect(ref3.deref()!.b).toBe(2);
})

test('equating typed array', () => {
  const array1 = new Uint8Array([1, 2]);
  const array2 = new Uint8Array([1, 2]);
  const array3 = new Uint8Array([3]);
  const array4 = new Uint8Array([3, 4]);
  expect(equals(array1, array2)).toBeTruthy();
  expect(equals(array1, array3)).toBeFalsy();
  expect(equals(array1, array4)).toBeFalsy();
  expect(equals(array1, 0)).toBeFalsy();
  expect(equals(array1, {})).toBeFalsy();
});

test('equating data views & array buffers', () => {
  const buffer1 = new ArrayBuffer(2);
  const view1 = new DataView(buffer1);
  const buffer2 = new ArrayBuffer(2);
  const view2 = new DataView(buffer2);
  const buffer3 = new ArrayBuffer(3);
  const view3 = new DataView(buffer3);
  const buffer4 = new ArrayBuffer(2);
  const view4 = new DataView(buffer4);
  view4.setUint8(0, 1);
  expect(equals(buffer1, buffer2)).toBeTruthy();
  expect(equals(buffer1, buffer3)).toBeFalsy();
  expect(equals(buffer1, buffer4)).toBeFalsy();
  expect(equals(buffer1, 0)).toBeFalsy();
  expect(equals(buffer1, {})).toBeFalsy();
  expect(equals(view1, view2)).toBeTruthy();
  expect(equals(view1, view3)).toBeFalsy();
  expect(equals(view1, view4)).toBeFalsy();
  expect(equals(view1, 0)).toBeFalsy();
  expect(equals(view1, {})).toBeFalsy();
});

test('equating data views & shared array buffers', () => {
  const buffer1 = new SharedArrayBuffer(2);
  const view1 = new DataView(buffer1);
  const buffer2 = new SharedArrayBuffer(2);
  const view2 = new DataView(buffer2);
  const buffer3 = new SharedArrayBuffer(3);
  const view3 = new DataView(buffer3);
  const buffer4 = new SharedArrayBuffer(2);
  const view4 = new DataView(buffer4);
  view4.setUint8(0, 1);
  expect(equals(buffer1, buffer2)).toBeTruthy();
  expect(equals(buffer1, buffer3)).toBeFalsy();
  expect(equals(buffer1, buffer4)).toBeFalsy();
  expect(equals(buffer1, 0)).toBeFalsy();
  expect(equals(buffer1, {})).toBeFalsy();
  expect(equals(view1, view2)).toBeTruthy();
  expect(equals(view1, view3)).toBeFalsy();
  expect(equals(view1, view4)).toBeFalsy();
  expect(equals(view1, 0)).toBeFalsy();
  expect(equals(view1, {})).toBeFalsy();
});

// Circular Objects 

test('circular object', () => {
  const a0: any = { b: null };
  a0.b = a0;
  const a1: any = { b: null };
  a1.b = a1;
  expect(equals(a0, a1)).toBeTruthy();
})

// Wrapped Primitive

test('wrapped bigint', () => {
  const wrappedBigInt = Object(10n);
  expect(equals(wrappedBigInt, 10n)).toBeTruthy();
  expect(equals(10n, wrappedBigInt)).toBeTruthy();
})

// * Classes *

test('equating class instances with value semantics', () => {
  @customize.equals()
  class ClassExample { }
  const instanceL = new ClassExample();
  const instanceR = new ClassExample();
  expect(equals(instanceL, instanceR)).toBeTruthy();
  expect(equals({}, instanceR)).toBeFalsy();
  expect(equals(instanceL, 0)).toBeFalsy();
})

test('equating class instances with class fields', () => {
  @customize.equals()
  class Example {
    constructor(public eg: string) { }
  }
  const instance0 = new Example('derive');
  const instance1 = new Example('derive');
  expect(equals(instance0, instance1)).toBeTruthy();
})

test('excludes a class field from comparison', () => {
  @customize.equals()
  class ExcludeExample {
    @equals.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instanceL = new ExcludeExample('excl0');
  const instanceR = new ExcludeExample('excl1');
  expect(equals(instanceL, instanceR)).toBeTruthy();
})

test('includes a class field in comparison', () => {
  @customize.equals({ propDefault: 'exclude' })
  class IncludeExample {
    @equals.include public includeField: string;
    constructor(includeField: string) {
      this.includeField = includeField;
    }
  }
  const instanceL = new IncludeExample('incl0');
  const instanceR = new IncludeExample('incl1');
  expect(equals(instanceL, instanceR)).toBeFalsy();
})

test('excludes all properties in comparison', () => {
  @customize.equals({ propDefault: 'exclude' })
  class ExcludeAllExample {
    public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instance0 = new ExcludeAllExample('excl0');
  const instance1 = new ExcludeAllExample('excl1');
  expect(equals(instance0, instance1)).toBeTruthy();
})

test('equating class instances with reference semantics', () => {
  @customize.equals('ref')
  class StrictEqualsExample { }
  const instanceL = new StrictEqualsExample();
  const instanceR = new StrictEqualsExample();
  expect(equals(instanceL, instanceR)).toBeFalsy();
})
