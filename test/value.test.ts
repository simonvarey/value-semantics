import { clone, customize, equals, value } from '../lib/main';
import { expect, test } from 'vitest'

// * Equals *

test('equating class instances with value semantics', () => {
  @customize.value
  class ClassExample { }
  const instanceL = new ClassExample();
  const instanceR = new ClassExample();
  expect(equals(instanceL, instanceR)).toBeTruthy();
  expect(equals({}, instanceR)).toBeFalsy();
  expect(equals(instanceL, 0)).toBeFalsy();
})

test('equating class instances with class fields', () => {
  @customize.value
  class Example {
    constructor(public eg: string) { }
  }
  const instance0 = new Example('derive');
  const instance1 = new Example('derive');
  expect(equals(instance0, instance1)).toBeTruthy();
})

test('excludes a class field from comparison', () => {
  @customize.value
  class ExcludeExample {
    @value.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instanceL = new ExcludeExample('excl0');
  const instanceR = new ExcludeExample('excl1');
  expect(equals(instanceL, instanceR)).toBeTruthy();
})

// * Clone *

// Non-constructor classes

test('clones a class instance without using a constructor function', () => {
  @customize.value
  class ClassExample { }
  const instance = new ClassExample();
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ClassExample).toBeTruthy();
})

test('excludes a class field from cloning', () => {
  @customize.value
  class ExcludeExample {
    @value.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }
  const instance = new ExcludeExample('excl');
  const instanceClone = clone(instance);
  expect(instanceClone.excludeField).toBeUndefined();
})

test('changing cloned class instances', () => {
  @customize.value
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

test('subclass inherits clone implementation', () => {
  @customize.value
  class ExcludeExample {
    @value.exclude public excludeField: string;
    constructor(excludeField: string) {
      this.excludeField = excludeField;
    }
  }

  class ExtendExample extends ExcludeExample { }
  const instance = new ExtendExample('excl');
  const instanceClone = clone(instance);
  expect(instanceClone.excludeField).toBeUndefined();
})

// * Equals and Clone *

test('equating and cloning class instances with value and deep clone semantics', () => {
  @customize.clone('deep', { runConstructor: false })
  @customize.equals('value')
  class ValueClassExample { }
  const instanceL = new ValueClassExample();
  const instanceR = new ValueClassExample();
  expect(equals(instanceL, instanceR)).toBeTruthy();
  expect(equals({}, instanceR)).toBeFalsy();
  expect(equals(instanceL, 0)).toBeFalsy();
})

test('equating and cloning class instances with ref and returnOriginal semantics', () => {
  @customize.clone('returnOriginal')
  @customize.equals('ref')
  class ValueClassExample { }
  const instanceL = new ValueClassExample();
  const instanceR = new ValueClassExample();
  expect(equals(instanceL, instanceR)).toBeFalsy();
})