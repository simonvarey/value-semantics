import { expect, test } from 'vitest'
import { customize, equals } from '../lib/main'

// * Primitives *

test('equating booleans', () => {
  expect(equals(true, true)).toBeTruthy();
  expect(equals(true, false)).toBeFalsy();
  expect(equals(true, new Boolean(true))).toBeTruthy();
  expect(equals(new Boolean(true), true)).toBeTruthy();
  expect(equals(new Boolean(true), new Boolean(true))).toBeTruthy();
})

test('equating undefined', () => {
  expect(equals(undefined, undefined)).toBeTruthy();
  expect(equals(undefined, {})).toBeFalsy();
})

test('equating symbols', () => {
  const sym = Symbol();
  expect(equals(sym, sym)).toBeTruthy();
  expect(equals(sym, {})).toBeFalsy();
  expect(equals(Symbol.for('x'), Symbol.for('x'))).toBeTruthy();
})

test('equating nulls', () => {
  expect(equals(null, null)).toBeTruthy();
  expect(equals(null, Object.create(null))).toBeFalsy();
  expect(equals(null, {})).toBeFalsy();
})

test('equating null and number', () => {
  expect(equals(null, 1)).toBeFalsy();
  expect(equals(1, null)).toBeFalsy();
})

test('equating numbers', () => {
  expect(equals(1, 1)).toBeTruthy();
  expect(equals(1, 2)).toBeFalsy();
  expect(equals(3, 1)).toBeFalsy();
  expect(equals(NaN, NaN)).toBeTruthy();
  expect(equals(1, NaN)).toBeFalsy();
  expect(equals(NaN, 1)).toBeFalsy();
  expect(equals(1, new Number(1))).toBeTruthy();
  expect(equals(new Number(1), 1)).toBeTruthy();
  expect(equals(new Number(1), new Number(1))).toBeTruthy();
  expect(equals(new Number(NaN), new Number(NaN))).toBeTruthy();
  expect(equals(NaN, new Number(NaN))).toBeTruthy();
  expect(equals(new Number(NaN), NaN)).toBeTruthy();
})

test('equating bigints', () => {
  expect(equals(1n, 1n)).toBeTruthy();
  expect(equals(1n, 2n)).toBeFalsy();
  expect(equals(3n, 1n)).toBeFalsy();
  expect(equals(1, BigInt(1))).toBeTruthy();
  expect(equals(BigInt(1), 1)).toBeTruthy();
  expect(equals(BigInt(1), BigInt(1))).toBeTruthy();
})

test('equating strings', () => {
  expect(equals('a', 'a')).toBeTruthy();
  expect(equals('b', 'c')).toBeFalsy();
  expect(equals('a', new String('a'))).toBeTruthy();
  expect(equals(new String('a'), 'a')).toBeTruthy();
  expect(equals(new String('a'), new String('a'))).toBeTruthy();
})

test('equating empty object and null', () => {
  expect(equals({}, null)).toBeFalsy();
  expect(equals(null, {})).toBeFalsy();
})

test('equating arrays', () => {
  expect(equals([1, 'a'], [1, 'a'])).toBeTruthy();
  expect(equals([1, 'a'], [1])).toBeFalsy();
})

test('equating arrays and numbers', () => {
  expect(equals([1, 'a'], 1)).toBeFalsy();
})

test('equating arrays and empty objects', () => {
  expect(equals([1, 'a'], {})).toBeFalsy();
})

test('equating functions', () => {
  const func1 = function (param: number): number { return param; };
  const func2 = function (param: number): number { return param; };
  expect(equals(func1, func1)).toBeTruthy();
  expect(equals(func1, func2)).toBeFalsy();
})

// * Objects *

// Object Literals

test('equating object literals', () => {
  expect(equals({ a: 1 }, { a: 1 })).toBeTruthy();
})

test('equating object literals and null prototype objects', () => {
  expect(equals({ a: 1 }, Object.create(null))).toBeFalsy();
})

test('equating different object literals', () => {
  expect(equals({ a: 1 }, { a: 2 })).toBeFalsy();
  expect(equals({ a: 1, b: 2 }, { a: 2 })).toBeFalsy();
})

test('equating null prototype objects', () => {
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

test('equating sets with value-equal members', () => {
  const set1 = new Set([{ a: 1 }, { a: 1 }, 'z']);
  const set2 = new Set([{ a: 1 }, 'y', 'z']);
  const set3 = new Set([{ a: 1 }, { a: 1 }, 'z']);
  expect(equals(set1, set2)).toBeFalsy();
  expect(equals(set2, set1)).toBeFalsy();
  expect(equals(set1, set3)).toBeTruthy();
  expect(equals(set3, set1)).toBeTruthy();
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

test('equating maps with value-equal keys', () => {
  const entry1: [unknown, unknown] = [{ a: 1 }, 'z'];
  const entry2: [unknown, unknown] = [{ a: 1 }, 'z'];
  const entry3: [unknown, unknown] = [{ a: 1 }, 'y'];
  const map1 = new Map([entry1, entry2]);
  const map2 = new Map([entry1, entry3]);
  const map3 = new Map([entry1, entry2]);
  expect(equals(map1, map2)).toBeFalsy();
  expect(equals(map2, map1)).toBeFalsy();
  expect(equals(map1, map3)).toBeTruthy();
  expect(equals(map3, map1)).toBeTruthy();
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

test('equating typed arrays', () => {
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

test('equating generators', () => {
  function* genFunc1(): Generator {
    yield 1;
    yield 2;
  }
  function* genFunc2(): Generator {
    yield 1;
    yield 2;
  }
  const gen1 = genFunc1();
  const gen2 = genFunc2();
  expect(equals(gen1, gen1)).toBeTruthy();
  expect(equals(gen1, gen2)).toBeFalsy();
})

test('equating async generators', () => {
  async function* genFunc1(): AsyncGenerator {
    yield 1;
    yield 2;
  }
  async function* genFunc2(): AsyncGenerator {
    yield 1;
    yield 2;
  }
  const gen1 = genFunc1();
  const gen2 = genFunc2();
  expect(equals(gen1, gen1)).toBeTruthy();
  expect(equals(gen1, gen2)).toBeFalsy();
})

// Circular Objects 

test('equating circular objects', () => {
  const a0: any = { b: null };
  a0.b = a0;
  const a1: any = { b: null };
  a1.b = a1;
  expect(equals(a0, a1)).toBeTruthy();
})

// Wrapped Primitive

test('equating wrapped bigints', () => {
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

test('equating class instances with iterate semantics', () => {
  @customize.equals('iterate')
  class ArraySuperExample<M> extends Array<M> { }
  const arr1 = new ArraySuperExample(1, 2);
  const arr2 = new ArraySuperExample(1, 2);
  expect(equals(arr1, arr2)).toBeTruthy();

  @customize.equals('iterate')
  class IterateExample {
    constructor(public members: string[]) { };

    [Symbol.iterator](): Iterator<string> {
      return this.members[Symbol.iterator]();
    }
  }
  const instance1 = new IterateExample(['a', 'b']);
  const instance2 = new IterateExample(['a', 'b']);
  expect(equals(instance1, instance2)).toBeTruthy();
})