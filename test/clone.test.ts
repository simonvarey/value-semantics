import { expect, test } from 'vitest'
import { clone, customize } from '../lib/main'

// * Primitives *

test('clones a null value', () => {
  const nullClone = clone(null);
  expect(nullClone).toBe(null);
})

test('clones an undefined value', () => {
  const undefinedClone = clone(undefined);
  expect(undefinedClone).toBe(undefined);
})

test('clones a boolean', () => {
  const trueClone = clone(true);
  expect(trueClone).toBe(true);
})

test('clones a number', () => {
  const tenClone = clone(10);
  expect(tenClone).toBe(10);
})

test('clones a bigint', () => {
  const bigTenClone = clone(10n);
  expect(bigTenClone).toBe(10n);
})

test('clones a symbol', () => {
  const symbolClone = clone(Symbol.for('test'));
  expect(symbolClone).toStrictEqual(Symbol.for('test'));
})

test('clones a function', () => {
  const func = function (param: number): number { return param; };
  const funcClone = clone(func);
  expect(funcClone instanceof Function).toBeTruthy();
  expect(funcClone(10)).toBe(10);
})

// Objects

test('clones an object literal', () => {
  const litObj = { a: 1 };
  const litObjClone = clone(litObj);
  expect(litObjClone.a).toBe(1);
  litObj.a = 2;
  expect(litObjClone.a).toBe(1);
  expect(litObj.a).toBe(2);
})

test('clones a null-prototype object', () => {
  const nullProtoObj = Object.create(null);
  nullProtoObj.a = 1;
  const nullProtoObjClone = clone(nullProtoObj);
  expect(nullProtoObjClone.constructor).toBeUndefined();
  expect(nullProtoObjClone.a).toBe(1);
  nullProtoObj.b = 4;
  expect(nullProtoObjClone.b).toBeUndefined();
})

test('clones an object literal with accessor properties', () => {
  const litObj = {
    a: 1,
    get b() {
      return this.a;
    },
    set b(x) {
      this.a = x;
    },
  };
  const litObjClone = clone(litObj);
  expect(litObjClone.a).toBe(1);
  litObj.a = 2;
  expect(litObjClone.a).toBe(1);
  expect(litObj.a).toBe(2);
})

// Builtins

test('clones an array', () => {
  const arr = [1, 'a'];
  const arrClone = clone(arr);
  expect(Array.isArray(arrClone)).toBeTruthy();
  expect(arrClone[0]).toBe(1);
  expect(arrClone[1]).toBe('a');
  arr[1] = 'b';
  expect(arr[1]).toBe('b');
  expect(arrClone[1]).toBe('a');
})

test('clones a set', () => {
  const set = new Set([1, 'a']);
  const setClone = clone(set);
  expect(setClone instanceof Set).toBeTruthy();
  expect(setClone.size === 2);
  set.add('b');
  expect(set.has('b')).toBeTruthy();
  expect(setClone.has('b')).toBeFalsy();
})

test('clones a map', () => {
  const map = new Map([[1, 'a'], [2, 'b']]);
  const mapClone = clone(map);
  expect(mapClone instanceof Map).toBeTruthy();
  expect(mapClone.get(1)).toBe('a');
  expect(mapClone.get(2)).toBe('b');
  map.set(1, 'b');
  expect(map.get(1)).toBe('b');
  expect(mapClone.get(1)).toBe('a');
})

test('clones a regexp', () => {
  const re = /ab/g;
  const reClone = clone(re);
  expect(reClone instanceof RegExp).toBeTruthy();
  re.test('tabulate');
  expect(reClone.lastIndex).toBe(0);
})

test('clones a date', () => {
  const date = new Date(2000, 0, 1);
  const dateClone = clone(date);
  expect(dateClone instanceof Date).toBeTruthy();
  date.setFullYear(2001);
  expect(dateClone.getFullYear()).toBe(2000);
})

test('clones a typed array', () => {
  const arr = new Uint8Array([1, 2]);
  const arrClone = clone(arr);
  expect(arrClone instanceof Uint8Array).toBeTruthy();
  arr[0] = 3;
  expect(arrClone[0]).toBe(1);
});

test('clones a data view & array buffer', () => {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setUint8(0, 1);
  const viewClone = clone(view);
  expect(view instanceof DataView).toBeTruthy();
  view.setUint8(0, 2);
  expect(viewClone.getUint8(0)).toBe(1);
});

test('clones a typed array & shared array buffer', () => {
  const buffer = new SharedArrayBuffer(2);
  const arr = new Int16Array(buffer);
  arr[0] = 1;
  const arrClone = clone(arr);
  expect(arrClone instanceof Int16Array).toBeTruthy();
  arr[0] = 2;
  expect(arrClone[0]).toBe(1);
});

// Wrapper Objects

test('clones a wrapped boolean', () => {
  const boolClone = clone(new Boolean(true));
  expect(boolClone).toBeTruthy();
})

test('clones a wrapped bigint', () => {
  const bigintClone = clone(Object(10n));
  expect(bigintClone.valueOf()).toStrictEqual(10n);
})

test('clones a wrapped symbol', () => {
  const symbolClone = clone(Object(Symbol.for('test')));
  expect(symbolClone.valueOf()).toBe(Symbol.for('test'));
})

// * Classes *

// Non-constructor classes

test('clones a class instance without using a constructor function', () => {
  @customize.clone()
  class ClassExample { }
  const instance = new ClassExample();
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ClassExample).toBeTruthy();
})

test('excludes a class field from cloning', () => {
  @customize.clone()
  class ExcludeExample {
    @clone.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instance = new ExcludeExample('excl');
  const instanceClone = clone(instance);
  expect(instanceClone.excludeField).toBeUndefined();
})

test('includes a class field in cloning', () => {
  @customize.clone({ propDefault: 'exclude' })
  class IncludeExample {
    @clone.include public includeField: string;
    constructor(includeField: string) {
      this.includeField = includeField;
    }
  }
  const instance = new IncludeExample('incl');
  const instanceClone = clone(instance);
  expect(instanceClone.includeField).toBe('incl');
})

test('excludes all properties in cloning', () => {
  @customize.clone({ propDefault: 'exclude' })
  class ExcludeAllExample {
    public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instance = new ExcludeAllExample('excl');
  const instanceClone = clone(instance);
  expect(instanceClone.excludeField).toBeUndefined();
})

test('error: cannot decorate field with both include and exclude', () => {
  expect(() => {
    @customize.clone()
    class IncludeExcludeExample {
      @clone.include @clone.exclude private _field = '';
    }
    const _instance = new IncludeExcludeExample(); // Needed for error to occur
  }).toThrowError(
    /^A field cannot be decorated with both `@include` and `@exclude`$/
  )
})

test('error: cannot clone errorOnClone class', () => {
  expect(() => {
    @customize.clone('errorOnClone')
    class ErrorOnCloneExample { }
    const instance = new ErrorOnCloneExample();
    const _instanceClone = clone(instance); // Needed for error to occur
  }).toThrowError(
    /^Instances of class ErrorOnCloneExample cannot be cloned$/
  )
})

test('clones a class instance using returnOriginal semantics', () => {
  @customize.clone('returnOriginal')
  class ReturnOriginalExample { }
  const instance = new ReturnOriginalExample();
  const instanceClone = clone(instance);
  expect(instance).toBe(instanceClone);
})

test('changing cloned class instances', () => {
  @customize.clone()
  class Example {
    constructor(public eg: string) { }
  }

  const original = new Example('test');
  const copy = clone(original);

  expect(copy instanceof Example).toBeTruthy();
  expect(copy.eg).toBe('test');
  copy.eg = 'new';
  expect(original.eg).toBe('test');
  expect(copy.eg).toBe('new');
  original.eg = 'old';
  expect(original.eg).toBe('old');
  expect(copy.eg).toBe('new');
})

// Constructor Classes

test('clones a class instance using a constructor function', () => {
  @customize.clone({runConstructor: true})
  class ConstructorExample {
    constructor() { }
  }
  const instance = new ConstructorExample();
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ConstructorExample).toBeTruthy();
})

test('clones a class instance using a constructor function with arguments', () => {
  @customize.clone({ runConstructor: true })
  class ConstructorExample {
    @clone.constructorParam public constructorField: string;
    constructor(constructorField: string) {
      if (constructorField === undefined) {
        throw new Error('Constructor not run');
      }
      this.constructorField = constructorField;
    }
  }
  const instance = new ConstructorExample('ctor');
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ConstructorExample).toBeTruthy();
  expect(instanceClone.constructorField).toBe('ctor');
})

test('subclass inherits clone implementation', () => {
  @customize.clone()
  class ExcludeExample {
    @clone.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  class ExtendExample extends ExcludeExample { }
  const instance = new ExtendExample('excl');
  const instanceClone = clone(instance);
  expect(instanceClone.excludeField).toBeUndefined();
})

test('constructorParams are implictly excluded', () => {
  @customize.clone({ runConstructor: true })
  class ConstructorExample {
    @clone.constructorParam public constructorField1: number;
    @clone.constructorParam @clone.include public constructorField2: number;
    constructor(constructorField1: number, constructorField2: number) {
      expect(constructorField1).not.toBeUndefined();
      expect(constructorField2).not.toBeUndefined();
      this.constructorField1 = constructorField1 + 1;
      this.constructorField2 = constructorField2 + 1;
    }
  }

  const instance = new ConstructorExample(1, 10);
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ConstructorExample).toBeTruthy();
  expect(instance.constructorField1).toBe(2);
  expect(instance.constructorField2).toBe(11);
  expect(instanceClone.constructorField1).toBe(3);
  expect(instanceClone.constructorField2).toBe(11);
})


test('class with iterate semantics', () => {
  @customize.clone('iterate', { addMethod: 'add' })
  class IterateExample {
    constructor(public members: string[]) { }

    [Symbol.iterator](): Iterator<string> {
      return this.members[Symbol.iterator]();
    }

    add(member: string): void {
      this.members.push(member);
    }
  }
  const instance = new IterateExample(['a', 'b']);
  const instanceClone = clone(instance);
  expect(instanceClone instanceof IterateExample).toBeTruthy();
  expect(instanceClone.members[0]).toBe('a');
})

// * Reference Cycles *

test('clones an object literal containing a reference cycle', () => {
  const obj1: { a: any } = { a: {} };
  const obj2 = { b: obj1 };
  obj1.a = obj2;
  const objClone = clone(obj1);
  expect(objClone).toBe(objClone.a.b);
})