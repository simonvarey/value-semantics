// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Equals Function **

// * Imports *

import { Constructor, EQUALS_EXCLUDE_PROPS, EQUALS_INCLUDE_PROPS, ClassDecorator_, EqualsVisited, 
  EQUALS_METHOD, TYPED_ARRAYS, getAllKeys, getKeys, PropKey, EqualMethodFunc, setMeta, getMeta, 
  META_NOT_FOUND } from "./common";

// * Helpers *

// Constants

export const REF_EQUALS = Symbol.for('ref-equals');

const WrappedPrimitives = [Boolean, Number, BigInt, String, Symbol];

// Utility Functions

function zip<TL, TR>(lArray: TL[], rArray: TR[]): [TL, TR][] {
  return lArray.map((l, i) => { return [l, rArray[i]]; });
}

// Metadata Helpers

function checkEqualsMethod(receiver: object, other: object, visited: EqualsVisited): void {
  const meth = getMeta<Function>(receiver, EQUALS_METHOD);
  if (meth === META_NOT_FOUND) {
    return;
  }
  throw meth.call(receiver, other, visited);
}

function checkRefEqualsProp(receiver: object, other: object): void {
  const val = getMeta(receiver, REF_EQUALS);
  if (val === META_NOT_FOUND) {
    return;
  }
  throw receiver === other;
}

// Visited Helpers

function checkVisited(fst: object, snd: object, visited: EqualsVisited): boolean | null {
  const fstVisited = visited.get(fst);
  if (fstVisited !== undefined) {
    const sndVisited = fstVisited.get(snd);
    if (sndVisited !== undefined) {
      return sndVisited;
    }
  }
  return null;
}

function setVisited(fst: object, snd: object, visited: EqualsVisited, res: boolean) {
  let fstVisited = visited.get(fst);
  if (fstVisited === undefined) {
    fstVisited = new Map();
    visited.set(fst, fstVisited);
  }
  fstVisited!.set(snd, res);
  let sndVisited = visited.get(snd);
  if (sndVisited === undefined) {
    sndVisited = new Map();
    visited.set(snd, sndVisited);
  }
  sndVisited!.set(fst, res);
}

// * Builtins *

// Definition Helpers

const defineEqualsMethod = <C extends Constructor<unknown>>(
  target: C, value: EqualMethodFunc<InstanceType<C>>
) => {
  setMeta(target, EQUALS_METHOD, value);
};

const defineRefEquals = (target: Constructor<unknown>) => {
  setMeta(target, REF_EQUALS, true);
};

// Equality Helpers

function checkExactPrototype<C extends Constructor<unknown>>(
  subject: unknown, constructor: C
): subject is InstanceType<C> {
  return Object.getPrototypeOf(subject) === constructor.prototype;
}

function wrappedPrimitiveEquals(obj: object, prim: unknown): boolean {
  for (const Wrapped of WrappedPrimitives) {
      if (obj instanceof Wrapped) {
        return obj.valueOf() === prim;
    }
  }
  return false;
}

function checkSetMembers(lhs: Set<unknown>, rhs: Set<unknown>, visited: EqualsVisited): boolean {
  outer: for (const l of lhs) {
    for (const r of rhs) {
      if (equalscyc(l, r, visited)) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

function checkMapMembers(
  lhs: Map<unknown, unknown>, rhs: Map<unknown, unknown>, visited: EqualsVisited
): boolean {  
  outer: for (const lKey of lhs.keys()) {
    for (const rKey of rhs.keys()) {
      if (equalscyc(lKey, rKey, visited)) {
        if (!(equalscyc(lhs.get(lKey), rhs.get(rKey), visited))) {
          return false;
        }
        continue outer;
      }
    }
    return false;
  }
  return true;
}

// Equals Methods on Builtins

defineEqualsMethod(
  Array, 
  function(this: unknown[], other: object, visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, Array)) {
      return false;
    }
    if (this.length !== other.length) {
      return false;
    }
    return zip(this, other).every(([l, r]) => equalscyc(l, r, visited));
  }
);

defineEqualsMethod(
  Set, 
  function(this: Set<unknown>, other: object, visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, Set)) {
      return false;
    }
    if (this.size !== other.size) {
      return false;
    }
    return checkSetMembers(this, other, visited);
  }
);

defineEqualsMethod(
  Map, 
  function(this: Map<unknown, unknown>, other: object, visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, Map)) {
      return false;
    }
    if (this.size !== other.size) {
      return false;
    }
    return checkMapMembers(this, other, visited);
  }
);

defineEqualsMethod(
  RegExp, 
  function(this: RegExp, other: object, _visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, RegExp)) {
      return false;
    }
    return this.toString() === other.toString();
  }
);

defineEqualsMethod(
  Date, 
  function(this: Date, other: object, _visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, Date)) {
      return false;
    }
    return +this === +other;
  }
);

defineEqualsMethod(
  ArrayBuffer, 
  function(this: ArrayBuffer, other: object, _visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, ArrayBuffer)) {
      return false;
    }
    if (this.byteLength !== other.byteLength) {
      return false;
    }
    const thisArray = new Uint8Array(this);
    const otherArray = new Uint8Array(other);
    for (let idx = 0; idx < this.byteLength; idx++) {
      if (thisArray[idx] !== otherArray[idx]) {
        return false;
      }
    }
    return true;
  }
);

defineEqualsMethod(
  SharedArrayBuffer, 
  function(this: SharedArrayBuffer, other: object, _visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, SharedArrayBuffer)) {
      return false;
    }
    if (this.byteLength !== other.byteLength) {
      return false;
    }
    const thisArray = new Uint8Array(this);
    const otherArray = new Uint8Array(other);
    for (let idx = 0; idx < this.byteLength; idx++) {
      if (thisArray[idx] !== otherArray[idx]) {
        return false;
      }
    }
    return true;
  }
);

defineEqualsMethod(
  DataView, 
  function(this: DataView, other: object, _visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, DataView)) {
      return false;
    }
    if (this.byteLength !== other.byteLength) {
      return false;
    }
    for (let offset = 0; offset < this.byteLength; offset++) {
      if (this.getInt8(offset) !== other.getInt8(offset)) {
        return false;
      }
    }
    return true;
  }
);

for (const typedArray of TYPED_ARRAYS) {
  defineEqualsMethod(
    typedArray, 
    function(this: InstanceType<typeof typedArray>, other: object, _visited: EqualsVisited): boolean {
      if (!checkExactPrototype(other, typedArray)) {
        return false;
      }
      if (this.byteLength !== other.byteLength) {
        return false;
      }
      for (let idx = 0; idx < this.byteLength; idx++) {
        if (this[idx] !== other[idx]) {
          return false;
        }
      }
      return true;
    }
  );
}

defineEqualsMethod(
  WeakRef, 
  function(this: WeakRef<WeakKey>, other: object, visited: EqualsVisited): boolean {
    if (!checkExactPrototype(other, WeakRef)) {
      return false;
    }
    return equalscyc(this.deref(), other.deref(), visited);
  }
);

defineRefEquals(WeakSet);
defineRefEquals(WeakMap);

// * Main Equals Function *

/**
 * Compares two values for value-equality.
 * @param lhs - The first value to compare.
 * @param rhs - The second value to compare.
 * @returns Whether the two values are value-equal.
 * @public
 */
export function equals(lhs: unknown, rhs: unknown): boolean {
  return equalscyc(lhs, rhs, new Map());
}

export function equalscyc(lhs: unknown, rhs: unknown, visited: EqualsVisited): boolean {
  // Quick return for reference-equals / primitives
  if (lhs === rhs) {
    return true;
  }
  // Null
  if (lhs === null || rhs === null) {
    return false;
  }
  // LHS non-object
  if (typeof lhs !== 'object') {
    if (typeof lhs === 'number' && isNaN(lhs)) {
      return typeof rhs === 'number' && isNaN(rhs);
    }
    if (typeof rhs === 'object') {
      return wrappedPrimitiveEquals(rhs, lhs);
    }
    return false;
  }
  // LHS object
  // RHS non-object
  if (typeof rhs !== 'object') {
    return wrappedPrimitiveEquals(lhs, rhs);
  }
  // Already visited objects
  const lrVisited = checkVisited(lhs, rhs, visited);
  if (lrVisited !== null) {
    return lrVisited;
  }
  // Set as equal initially - this prevents infinite recursion
  setVisited(lhs, rhs, visited, true);
  // Objects with REF_EQUALS or EQUALS_METHOD
  try {
    checkEqualsMethod(lhs, rhs, visited);
    checkEqualsMethod(rhs, lhs, visited);
    checkRefEqualsProp(lhs, rhs);
    checkRefEqualsProp(rhs, lhs);
  } catch (except) {
    if (typeof except === "boolean") {
      setVisited(lhs, rhs, visited, except);
      return except;
    } else {
      throw except;
    }
  }
  // Other Objects
  if (Object.getPrototypeOf(lhs) !== Object.getPrototypeOf(rhs)) {
    setVisited(lhs, rhs, visited, false);
    return false;
  }
  const lhsKeys = getAllKeys(lhs);
  const rhsKeys = getAllKeys(rhs);
  if (lhsKeys.size !== rhsKeys.size) {
    return false;
  }
  if (lhsKeys.intersection(rhsKeys).size !== lhsKeys.size) {
    return false;
  }
  for (const key of lhsKeys) {
    if (!(equalscyc(lhs[key as keyof typeof lhs], rhs[key as keyof typeof rhs], visited))) {
      setVisited(lhs, rhs, visited, false);
      return false;
    }
  }
  setVisited(lhs, rhs, visited, true);
  return true;
}

// * Equals Customization Decorators *

// Types

export const EQUALS_SEMANTICS = ['value', 'ref'] as const;
export type EqualsSemantics = typeof EQUALS_SEMANTICS[number];

export type CustomizeEqualsOptions = {
  propDefault?: 'include' | 'exclude'
}

// Helpers

function checkExactSamePrototype<I>(lhs: I, rhs: unknown): rhs is I {
  return Object.getPrototypeOf(lhs) === Object.getPrototypeOf(rhs);
}

// Class Decorator

export function customizeEquals<I extends object>(options?: CustomizeEqualsOptions): ClassDecorator_<I>
export function customizeEquals<I extends object>(
  semantics: 'value', options?: CustomizeEqualsOptions
): ClassDecorator_<I>
export function customizeEquals<I extends object>(semantics: 'ref'): ClassDecorator_<I>
export function customizeEquals<I extends object>(
  semanticsOrOpts?: EqualsSemantics | CustomizeEqualsOptions, options?: CustomizeEqualsOptions
): ClassDecorator_<I> {
  const semantics: EqualsSemantics = typeof semanticsOrOpts === 'string' ? semanticsOrOpts : 'value';
  
  if (!options) {
    if (typeof semanticsOrOpts === 'object') {
      options = semanticsOrOpts;
    } else {
      options = { };
    }
  }
  const opts: Required<CustomizeEqualsOptions> = { propDefault: 'include', ...options };

  return function(_constructor: Constructor<I>, context: ClassDecoratorContext): void {
    if (semantics === 'ref') {
      context.metadata[REF_EQUALS] = true;
      return;
    };

    context.metadata[EQUALS_METHOD] = function(this: I, other: object, visited: EqualsVisited): boolean {
      if (!checkExactSamePrototype(this, other)) {
        return false;
      }
      const equalsProps = getKeys(this, opts.propDefault, 'equals');
      for (const key of equalsProps) {
        if (!(equalscyc(this[key as keyof I], other[key as keyof I], visited))) {
          return false;
        }
      }
      return true;
    };
  }
}

// Property Decorators

/**
 * Class field decorators which allow the class' `equals` implementations to be customized.
 * @public
 */
export namespace equals {

  export function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void {
    context.metadata[EQUALS_INCLUDE_PROPS] ??= new Set();
    (context.metadata[EQUALS_INCLUDE_PROPS] as Set<PropKey>).add(context.name);
  }
  
  export function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void {
    context.metadata[EQUALS_EXCLUDE_PROPS] ??= new Set();
    (context.metadata[EQUALS_EXCLUDE_PROPS] as Set<PropKey>).add(context.name);
  }
  
}
