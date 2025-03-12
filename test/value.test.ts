import { clone, customize, equals, value } from '../lib/main';
import { expect, test } from 'vitest'

// * Equals *

test('equating class instances with value semantics', () => {
  @customize.value()
  class ClassExample { }
  const instanceL = new ClassExample();
  const instanceR = new ClassExample();
  expect(equals(instanceL, instanceR)).toBeTruthy();
  expect(equals({}, instanceR)).toBeFalsy();
  expect(equals(instanceL, 0)).toBeFalsy();
})

test('equating class instances with class fields', () => {
  @customize.value()
  class Example {
    constructor(public eg: string) { }
  }
  const instance0 = new Example('derive');
  const instance1 = new Example('derive');
  expect(equals(instance0, instance1)).toBeTruthy();
})

test('excludes a class field from comparison', () => {
  @customize.value()
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

test('includes a class field in comparison', () => {
  @customize.value({ propDefault: 'exclude' })
  class IncludeExample {
    @value.include public includeField: string;
    constructor(includeField: string) {
      this.includeField = includeField;
    }
  }
  const instanceL = new IncludeExample('incl0');
  const instanceR = new IncludeExample('incl1');
  expect(equals(instanceL, instanceR)).toBeFalsy();
})

test('excludes all properties in comparison', () => {
  @customize.value('value', { propDefault: 'exclude' })
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
  @customize.value('ref')
  class StrictEqualsExample { }
  const instanceL = new StrictEqualsExample();
  const instanceR = new StrictEqualsExample();
  expect(equals(instanceL, instanceR)).toBeFalsy();
})

// * Clone *

// Non-constructor classes

test('clones a class instance without using a constructor function', () => {
  @customize.value()
  class ClassExample { }
  const instance = new ClassExample();
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ClassExample).toBeTruthy();
})

test('excludes a class field from cloning', () => {
  @customize.value()
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

test('includes a class field in cloning', () => {
  @customize.value({ propDefault: 'exclude' })
  class IncludeExample {
    @value.include public includeField: string;
    constructor(includeField: string) {
      this.includeField = includeField;
    }
  }
  const instance = new IncludeExample('incl');
  const instanceClone = clone(instance);
  expect(instanceClone.includeField).toBe('incl');
})

test('excludes all properties in cloning', () => {
  @customize.value({ propDefault: 'exclude' })
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

test('error: cannot clone errorOnClone class', () => {
  expect(() => {
    @customize.value('errorOnClone')
    class NoCloneExample { }
    const instance = new NoCloneExample();
    const copy = clone(instance); //Needed to throw
  }).toThrowError(
    /^Instances of class NoCloneExample cannot be cloned$/
  )
})

test('changing cloned class instances', () => {
  @customize.value()
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
  @customize.value({runConstructor: true})
  class ConstructorExample {
    constructor() { }
  }
  const instance = new ConstructorExample();
  const instanceClone = clone(instance);
  expect(instanceClone instanceof ConstructorExample).toBeTruthy();
})

test('clones a class instance using a constructor function with arguments', () => {
  @customize.value({ runConstructor: true })
  class ConstructorExample {
    @clone.constructorParam public constructorField: string;
    constructor(constructorField: string) {
      if (constructorField === undefined) {
        throw new Error('Constructor not run')
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
  @customize.value()
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
  @customize.value('deep', 'value', { runConstructor: false })
  class ValueClassExample { }
  const instanceL = new ValueClassExample();
  const instanceR = new ValueClassExample();
  expect(equals(instanceL, instanceR)).toBeTruthy();
  expect(equals({}, instanceR)).toBeFalsy();
  expect(equals(instanceL, 0)).toBeFalsy();
})

test('equating and cloning class instances with ref and returnOriginal semantics', () => {
  @customize.value('ref', 'returnOriginal')
  class ValueClassExample { }
  const instanceL = new ValueClassExample();
  const instanceR = new ValueClassExample();
  expect(equals(instanceL, instanceR)).toBeFalsy();
})