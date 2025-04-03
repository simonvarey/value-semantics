# Value-Semantics

**The JavaScript/TypeScript Value Semantics Toolkit**

> All the functions you need to program as if objects in JavaScript had value semantics, including comprehensive and highly customizable deep cloning and equality functions.

<span class="badge-npmversion"><a href="https://npmjs.org/package/value-semantics" title="View this project on NPM"><img src="https://img.shields.io/npm/v/value-semantics.svg" alt="NPM version" /></a></span>
<span class="badge-licence"><a href="https://opensource.org/license/mit" title="View this project's license"><img src="https://img.shields.io/npm/l/value-semantics.svg" alt="License" /></a></span>
![Statements](https://img.shields.io/badge/statements-99.71%25-brightgreen.svg?style=flat)

- [Value-Semantics](#value-semantics)
  - [What is `value-semantics`?](#what-is-value-semantics)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Deep Cloning](#deep-cloning)
    - [Value-Equality](#value-equality)
    - [Customization](#customization)
  - [Development](#development)
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

### Customization 

By default, the result of applying `clone` or `equals` to an instance of a user-defined class is the same as applying it to any other (non-exotic) object: i.e. `equals` will compare an instance of a class equal to another value if and only if the other value is an object of the same class with the same property keys and values, and `clone` will return a new instance of the class with cloned property values.

It is, however, possible to customize these results for user-defined classes using decorators included in value-semantics. The following behaviors can be customized for instances of a user-defined class:
- Particular properties can be excluded from cloning and equality comparison, for both `clone` and/or `equals`.
- All properties can be excluded from cloning and equality comparison by default, and certain properties can then be included, for both `clone` and/or `equals`.
- Instances can be cloned and/or compared for equality using their iterator property instead.
- `clone` can be changed to return the original instance, or to throw an error.
- `clone` can be changed to run the class' constructor, and arguments can be specified for the constructor (where those arguments are provided by particular properties of the original).
- `equals` can be changed to compare instances by reference-equality.

See (the wiki)[https://github.com/simonvarey/value-semantics/wiki/Customization] for API documentation for the customization decorators. Currently, the results of applying `clone` or `equals` to instances of built-in classes, exotic objects, and object literals cannot be customized.

## Development

Use `npm i` and then `npm run build` to build the library.

`value-semantics` contains a playground at `dev/playground.ts` which you can use to test out the functionality of the toolbox. (Note that you need to build the library once before using the playground). Use `npm run playground` to run the playground. The playground can also be used to test out changes to the toolbox, by re-building library after making the changes.

## License

MIT