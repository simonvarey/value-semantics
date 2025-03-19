# Value-Semantics

**The JavaScript/TypeScript Value Semantics Toolkit**

*All the functions you need to program as if objects in JavaScript had value semantics, including comprehensive and highly customisible deep cloning and equality functions*

<span class="badge-npmversion"><a href="https://npmjs.org/package/value-semantics" title="View this project on NPM"><img src="https://img.shields.io/npm/v/value-semantics.svg" alt="NPM version" /></a></span>
<span class="badge-licence"><a href="https://opensource.org/license/mit" title="View this project's license"><img src="https://img.shields.io/npm/l/value-semantics.svg" alt="License" /></a></span>
![Statements](https://img.shields.io/badge/statements-99.71%25-brightgreen.svg?style=flat)

- [Value-Semantics](#value-semantics)
  - [What is `value-semantics`?](#what-is-value-semantics)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Deep Cloning](#deep-cloning)
    - [Value-Equality](#value-equality)
    - [Customizing `clone` and `equals` Implementations](#customizing-clone-and-equals-implementations)
      - [Customizing `clone` Implementations](#customizing-clone-implementations)
        - [Constructor Parameter Decorator](#constructor-parameter-decorator)
        - [Property Inclusion/Exclusion Decorators](#property-inclusionexclusion-decorators)
      - [Customizing `equals` Implementations](#customizing-equals-implementations)
        - [Property Inclusion/Exclusion Decorators](#property-inclusionexclusion-decorators-1)
      - [Customizing `clone` and `equals` Implementations Simultaneously](#customizing-clone-and-equals-implementations-simultaneously)
        - [Property Inclusion/Exclusion Decorators](#property-inclusionexclusion-decorators-2)
  - [License](#license)

## What is `value-semantics`?

`value-semantics`, the JavaScript/TypeScript value semantics toolkit, is a TypeScript utility library which allows (almost) every JavaScript object to be treated as if it had value semantics, including user-defined classes and builtin exotic objects. The toolkit's `clone` function allows objects to be copy-assigned like primitive values, rather than alias-assigned like objects typically are in JavaScript, while the toolkit's `equals` function allows objects to be compared by value-equality, rather than reference-equality. Easy customization of these functions for user-defined classes, such as excluding properties from cloning/comparison and setting arguments for cloning constructors, is possible using decorators. Of course, these functions are not limited to mimicking value semantics, but can be used anywhere deep cloning or equality comparisons are desired.

```ts
// Compare objects by value-equality
const lincolnBirthDate = new Date(1809, 1, 12);
const darwinBirthDate = new Date(1809, 1, 12);
console.assert(equals(lincolnBirthDate, darwinBirthDate));

// Deep clone objects to avoid unwanted aliasing and to pass function parameters 
//   by value
type Vector = { x: number, y: number };
function scale(vector: Vector, scale: number): Vector {
  vector.x *= scale;
  vector.y *= scale;
  return vector;
}

const vector1 = { x: 2, y: 3 };
const vector2 = scale(clone(vector1), 2);
console.assert(equals(vector2, { x: 4, y: 6 }));
console.assert(equals(vector1, { x: 2, y: 3 }));

// Customize `equals` and `clone` implementations on user-defined classes using 
//   decorators
@customize.value({ runConstructor: true }) // Customize `equals` and `clone` implementations
//   simultaneously using the `@customize.value` decorator
class Rectangle {
  @clone.constructorParam private height: number; // Specify which properties 
  //   should be used as parameters for the cloning constructor
  @clone.constructorParam private width: number;
  @equals.exclude private orientation: number; // Exclude properties from cloning 
  //   and/or equality comparison

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
    this.orientation = 0;
  }
}

const rect1 = new Rectangle(10, 20);
const rect2 = clone(rect1);
console.assert(rect1 !== rect2);
console.assert(equals(rect1, rect2));
rect2.orientation = 90;
console.assert(equals(rect1, rect2));
console.assert(rect1.orientation === 0);

```

## Installation

Run `npm install value-semantics` to install this library.

## Usage

### Deep Cloning

```ts 
clone<T>(source: T): T
```

Use the `clone` function to create a deep clone of a JavaScript value. Roughly, the clone of an object 
will have the same prototype and the same (enumerable, own) property keys as the original, and the 
respective values for those keys are clones of the values of the original keys. Clones are independent of their originals, in the sense that any changes to a clone will not propagate to the original object, and vice versa.

```ts
const obj = { a: 1, b: [2, 3], c: new Date(2000, 0, 1), d: { e: 4 } };
const objcopy = clone(obj);
console.assert(objcopy.d.e === 4);
console.assert(objcopy.b[1] === 3);
obj.d.e = 5;
objcopy.b[1] = 6;
console.assert(objcopy.d.e === 4);
console.assert(obj.b[1] === 3);
```

### Value-Equality

```ts 
equals(lhs: unknown, rhs: unknown): boolean 
```

Use the `equals` function to compare two JavaScript values for value-equality. Broadly speaking, this 
function considers two objects equal when they both have the same prototype, same (enumerable, own) 
property keys and the respective values for those keys are value-equal. This function can be customized for user-created classes, as discussed below.

```ts
const obj1 = { a: 1, b: [2, 3], c: new Date(2000, 0, 1), d: { e: 4 } };
const obj2 = { d: { e: 4 }, c: new Date(2000, 0, 1), b: [2, 3], a: 1 };
console.assert(equals(obj1, obj2));
```

### Customizing `clone` and `equals` Implementations

By a `clone` or `equals` implementation for a class, I mean the algorithm used to determine the results of calling `clone` or `equals` on an instance of that class. User-defined classes automatically have default implementations for `clone` and `equals`, where `equals` will compare an instance of a class equal to another value if and only if the other object is of the same class and has the same property values, and `clone` will return a new instance of the class with cloned property values. However, `clone` and `equals` implementations can be customized for user-defined classes using the decorators included in this toolkit.

#### Customizing `clone` Implementations

```ts 
@customize.clone(
  semantics?: CloneSemantics = 'deep',
  options?: CustomizeCloneOptions = {}
)
```

The `@customize.clone` class decorator can be used to customize the `clone` implementation for a class. When called with no arguments, or (one or both) default arguments, the decorated class will have the default implementation (i.e. `@customize.clone` will be a no-op). Otherwise, the `clone` implementation can be customized in the following ways:

```ts
type CloneSemantics = 'deep' | 'returnOriginal' | 'errorOnClone';
```

The `semantics` parameter can be used to customize the semantics of the class' `clone` implementation. There are 3 kinds of semantics that a `clone` implementation can have:

- `'deep'`: This is the default semantics, where `clone` returns a deep clone of the class instance.
- `'returnOriginal'`: With this semantics, `clone` will return the original class instance without any cloning being performed.
- `'errorOnClone'`: With this semantics, `clone` will throw a `ValueSemanticsError` at runtime when applied to a instance of this class.

```ts
type CustomizeCloneOptions = {
  runConstructor?: boolean = false,
  propDefault?: 'include' | 'exclude' = 'include'
}
```

If a class' `clone` implementation has `'deep'` semantics, then it can be further customized using the `options` parameter. The `options` parameter cannot be passed for classes with `'returnOriginal'` or `'errorOnClone'` semantics, as those semantics have no additional customization options. There are two properties which can be specified using the `options` parameter:

`runConstructor`: By default, and when this property is `false`, clones of a class instance are created by `Object.create()`, before the instance's properties are copied over. When this property is `true`, clones of a class instance are created by the class' constructor. Arguments for the constructor call can be specified using the `@clone.constructorParam` decorator described below, otherwise the constructor will run without any arguments. 

For example:
```ts
@customize.clone({ runConstructor: true }) 
class Graph {
  public nodes: Nodes[];
  public edges: Edge[];

  constructor() {
    this.nodes = [];
    this.edges = [];
  }
}

const originalGraph = new Graph();
const clonedGraph = clone(originalGraph); 
  // calls Graph.prototype.constructor()
```

`propDefault`: By default, and when this property is `'include'`, every (own, enumerable) property of an instance of the class will be copied over to its clones, unless otherwise specified using the `@clone.exclude` (or `@value.exclude`) decorator described below. In contrast, when this property is `'exclude'`, no properties of an instance of the class will be copied over to its clones, unless otherwise specified using the `@clone.include` (or `@value.include`) decorator described below.

##### Constructor Parameter Decorator

```ts 
@clone.constructorParam
```

On a class with `'deep'` clone semantics and `runConstructor: true`, labelling a class field with `@clone.constructorParam` means that the value of that field will be provided to the constructor as an argument when cloning an instance of the class. On any other class, `@clone.constructorParam` has no effect. If multiple fields are labelled with `@clone.constructorParam`, they will be provided to the constructor in order, top to bottom.

For example:
```ts
@customize.clone({ runConstructor: true }) 
class Person {
  @clone.constructorParam private height: number;
  @clone.constructorParam private age: number;

  constructor(height: number, age: number) {
    this.height = height;
    this.age = age;
  }
}

const originalPerson = new Person(178, 36);
const clonedPerson = clone(originalPerson); 
  // calls Person.prototype.constructor(178, 36)
```

On a class which also has `propDefault: include`, labelling a class field with `@clone.constructorParam` will cause that field to be excluded from the clone implementation by default, unless the field is also labelled with `@clone.include` (or `@value.include`).

##### Property Inclusion/Exclusion Decorators

```ts
@clone.exclude
@clone.include
```

On a class with `'deep'` clone semantics and `propDefault: include`, decorating a class field with 
`@clone.exclude` will override the default and exclude that field when cloning an instance of the class. On _any_ class with `'deep'` clone semantics, decorating a field with both `@clone.exclude` and 
`@clone.include` (or `@value.include`) will throw a `ValueSemanticsError` at runtime on class definition. Otherwise, `@clone.exclude` has no effect.

On a class with `'deep'` clone semantics and `propDefault: exclude`, decorating a class field with 
`@clone.include` will override the default and include that field when cloning an instance of the class. On a class with `'deep'` clone semantics, `propDefault: include` and `runConstructor: true`, 
decorating a `@clone.constructorParam` field with `@clone.include` in addition will override the 
default and include that field when cloning an instance of the class (in addition to it being a 
constructor parameter). On _any_ class with `'deep'` clone semantics, decorating a field with 
both `@clone.include` and `@clone.exclude` (or `@value.exclude`) will throw a `ValueSemanticsError` at runtime on class definition. Otherwise, `@clone.include` has no effect.

#### Customizing `equals` Implementations

```ts 
@customize.equals(
  semantics?: EqualsSemantics = 'value',
  options?: CustomizeEqualsOptions = {}
)
```

The `@customize.equals` class decorator can be used to customize the `equals` implementation for a class. When called with no arguments, or (one or both) default arguments, the decorated class will have the default implementation (i.e. `@customize.equals` will be a no-op). Otherwise, the `equals` implementation can be customized in the following ways:

```ts
type EqualsSemantics = 'value' | 'ref';
```

The `semantics` parameter can be used to customize the semantics of the class' `equals` implementation. There are 2 kinds of semantics that an `equals` implementation can have:

- `'value'`: This is the default semantics, where `equal` compares two instances of the class as equal if and only if they are value-equals (roughly, when they have the same property values).
- `'ref'`: With this semantics, `equal` compares two instances of the class as equal if and only if they  refer to the same instance. In other words, on this semantics `equals` is the same as `===`.

```ts
type CustomizeEqualsOptions = {
  propDefault?: 'include' | 'exclude' = 'include'
}
```

If a class' `clone` implementation has `'value'` semantics, then it can be further customized using the `options` parameter. The `options` parameter cannot be passed for classes with `'ref'` semantics, as it has no additional customization options. There is one property which can be specified using the `options` parameter:

`propDefault`: By default, and when this property is `'include'`, every (own, enumerable) property of 
an instance of the class will used to compare instances for equality, unless otherwise specified 
using the `@equals.exclude` (or `@value.exclude`) decorator described below. In constrast, when this property is `'exclude'`, no properties of an instance of the class will be used to compare instances for equality (meaning all instances of the class compare as equal), unless otherwise specified using the `@equals.include` (or `@value.include`) decorator described below.

##### Property Inclusion/Exclusion Decorators

```ts 
@equals.include
@equals.exclude
```

On a class with `'value'` equals semantics and `propDefault: exclude`, decorating a class field with
`@equals.include` will override the default and include that field when making equality comparisons.  On _any_ class with `'value'` equals semantics, decorating a field with both `@equals.include` and 
`@equals.exclude` (or `@value.exclude`) will throw a `ValueSemanticsError` at runtime on class definition. Otherwise, `@equals.include` has no effect.

On a class with `'value'` equals semantics and `propDefault: include`, decorating a class field with
`@equals.exclude` will override the default and exclude that field when making equality comparisons.  On _any_ class with `'value'` equals semantics, decorating a field with both `@equals.exclude` and 
`@equals.include` (or `@value.include`) will throw a `ValueSemanticsError` at runtime on class definition. Otherwise, `@equals.exclude` has no effect.

#### Customizing `clone` and `equals` Implementations Simultaneously

```ts 
@customize.value(
  cloneSemantics?: CloneSemantics = 'deep' // cloneSemantics and equalsSemantics can be
  equalsSemantics?: EqualsSemantics = 'value' //    in either order
  options: CustomizeValueOptions = {}
)
```

It is possible to customize the implementations of both `equals` and `clone` on a class by decorating it with both `@customize.equals` and `@customize.clone`. However, to save space, this library also provides the `@customize.value` decorator, which customizes both of these functions at the same time. 

When called with no arguments, or (one, two or all of the) default arguments, the decorated class will have the default implementations for `equals` and `clone` (i.e. `@customize.value` will be a no-op). Otherwise, the `equals` and `clone` implementations can be customized in the following ways:

The `cloneSemantics` parameter can be used to customize the semantics of the class' `clone` implementation. The values that this parameter can take, and their meanings, are the same as for the `semantics` parameter of the `@customize.clone` decorator.

The `equalsSemantics` parameter can be used to customize the semantics of the class' `equals` implementation. The values that this parameter can take, and their meanings, are the same as for the `semantics` parameter of the `@customize.equals` decorator.

Note that the `cloneSemantics` and `equalsSemantics` can be provided in either order, although if one or both of them are present they must come before the `options` parameter (if it is present).

```ts
type CustomizeValueOptions = {
  runConstructor?: boolean = false,
  propDefault?: 'include' | 'exclude' = 'include'
}
```
If a class' has `'deep' clone` and/or `'value' equals` semantics, then it can be further customized using the `options` parameter. Note that the `options` parameter cannot be passed for classes with `'ref' equals` and `'returnOriginal'` or `'errorOnClone' clone` semantics, as those semantics have no additional customization options. There are two properties which can be specified using the `options` parameter:

`runConstructor`: The values that this property can take, and their meanings, are the same as for the `runConstructor` parameter of the `@customize.clone` decorator. As in the `@customize.clone` case, arguments for the constructor call can be specified using the `@clone.constructorParam` decorator described above, but note that there is no `@value.constructorParam` decorator. Note also that this property cannot be specified if the class has `'returnOriginal'` or `'errorOnClone' clone` semantics, as those semantics cannot involve running a constructor. This is true even if the class has `'value' equals` semantics, and can therefore take an `options` argument.

`propDefault`: The values that this property can take, and their meanings, are the same as for the `propDefault` parameters of the `@customize.clone` and `@customize.equals` decorators. In other words, setting `propDefault` to `'include'` (`'exclude'`) is equivalent to setting `propDefault` to `'include'` (`'exclude'`) on both `@customize.clone` and `@customize.equals`. Note that `@customize.value` does not allow *different* values to be set for `propDefault` for `clone` and `equals` implementations. To do so, you would have to use seperate `@customize.equals` and `@customize.clone` decorators. Note also that, given a `propDefault: 'include'` value, decorating a class field with `@clone.constructorParam` will exclude that property from *cloning* but not *equality comparisons*. This can be overridden by either the `@clone.include` or `@value.include` decorators (but not `@equals.include`).

##### Property Inclusion/Exclusion Decorators

```ts 
@value.include
@value.exclude
```

Decorating a class field with `@value.include` (`@value.exclude`) has the same effect as decorating that field with both `@clone.include` and `@equals.include` (`@clone.exclude` and `@equals.exclude`). This means that, for example, decorating a class field with `@value.include` on a class decorated only with `@customize.equals({ propDefault: exclude })` will have the same effect has decorating that field with just `@equals.include` (i.e. the `@clone.include` aspect is a no-op). Any combination of field decorators which leads to a field being decorated with both `@clone.include` and `@clone.exclude`, and /or `@equals.include` and `@equals.exclude`, will throw a `ValueSemanticsError` at runtime on class definition. For example, decorating a field with `@value.exclude` and `@clone.include` will lead to such an error (even if the `@clone.exclude` aspect of `@value.exclude` is otherwise a no-op). On a class with `'deep'` clone semantics, `propDefault: include` and `runConstructor: true`, decorating a `@clone.constructorParam` field with `@value.include` in addition will override the default and include that field when cloning an instance of the class (in addition to it being a constructor parameter).

## License

MIT