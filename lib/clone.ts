// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Clone Function **

// * Imports & Symbols *

// Imports

import { CLONE_EXCLUDE_PROPS, CLONE_INCLUDE_PROPS, CLONE_METHOD, TYPED_ARRAYS, PropKey, 
  getAllKeys, getKeys, getMeta, META_NOT_FOUND, CloneMethodFunc, setMeta, CONSTRUCTOR_PROPS, 
  ValueSemanticsError, CloneVisited, ClassDecorator_, Constructor, 
  isGenerator} from "./common";

// Symbols

export const ERROR_ON_CLONE = Symbol.for('error-on-clone');

// * Helper Functions *

// Object Construction

type ConstructorOf<Instance> = { new(...args: any[]): Instance; };

function constructTarget<T extends object>(source: T): T {
  const constructor = source.constructor as ConstructorOf<T>;
  let constructorKeys = getMeta(source, CONSTRUCTOR_PROPS);
  if (constructorKeys === META_NOT_FOUND) {
    constructorKeys = [];
  }
  const constructorArgs = (constructorKeys as (keyof typeof source)[])
    .map((key) => { return source[key]; });
  return new constructor(...constructorArgs);
}

function createTarget<T extends object>(source: T): T {
  return Object.create(Object.getPrototypeOf(source));
}

// Property Copying

export function copyProps<T extends Object>(
  props: Set<PropKey>, target: T, source: T, visited: CloneVisited
) {
  for (const key of props) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key as keyof T)!;
    if (descriptor.get || descriptor.set) {
      Object.defineProperty(target, key as keyof T, descriptor);
    } else {
      Object.defineProperty(
        target,
        key as keyof T,
        {
          value: clonecyc(source[key as keyof T], visited),
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          enumerable: descriptor.enumerable,          
        }
      );
    }
  }
}

// * Clone Methods on Built-ins *

const defineCloneMethod = <C extends Constructor>(
  target: C, value: CloneMethodFunc<InstanceType<C>>
) => {
  setMeta(target, CLONE_METHOD, value);
};

defineCloneMethod(Array, function<T>(this: T[], visited: CloneVisited): T[] {
  const target: T[] = [];
  visited.set(this, target);
  this.forEach((member, idx) => target[idx] = clonecyc(member, visited));
  return target;
})

defineCloneMethod(Set, function<T>(this: Set<T>, visited: CloneVisited): Set<T> {
  const target = new Set<T>();
  visited.set(this, target);
  this.forEach((member) => target.add(clonecyc(member, visited)));
  return target;
})

defineCloneMethod(Map, function<K, V>(this: Map<K, V>, visited: CloneVisited): Map<K, V> {
  const target = new Map<K, V>();
  visited.set(this, target);
  this.forEach((value, key) => target.set(clonecyc(key, visited), clonecyc(value, visited)));
  return target;
})

defineCloneMethod(RegExp, function(this: RegExp, visited: CloneVisited): RegExp {
  const target = new RegExp(this);
  visited.set(this, target);
  return target;
});

defineCloneMethod(Date, function(this: Date, visited: CloneVisited): Date {
  const target = new Date(this);
  visited.set(this, target);
  return target;
});

defineCloneMethod(ArrayBuffer, function(this: ArrayBuffer, visited: CloneVisited): ArrayBuffer {
  const target = this.slice(0);
  visited.set(this, target);
  return target;
});

defineCloneMethod(SharedArrayBuffer, function(this: SharedArrayBuffer, visited: CloneVisited): SharedArrayBuffer {
  const target = this.slice(0);
  visited.set(this, target);
  return target;
});

defineCloneMethod(DataView, function(this: DataView, visited: CloneVisited): DataView {
  const target = new DataView(clone(this.buffer), this.byteOffset, this.byteLength);
  visited.set(this, target);
  return target;
});

for (const TypedArray of TYPED_ARRAYS) {
  defineCloneMethod(
    TypedArray, 
    function (
      this: InstanceType<typeof TypedArray>, visited: CloneVisited
    ): InstanceType<typeof TypedArray> {
      const target = new TypedArray(clone(this.buffer), this.byteOffset, this.length);
      visited.set(this, target);
      return target;
    }
  );
}

function defineCloneReturnOriginal<C extends Constructor>(proto: C) {
  defineCloneMethod(proto, function(this: InstanceType<C>, visited: CloneVisited): InstanceType<C> {
    visited.set(this, this);
    return this;
  })
}

defineCloneReturnOriginal(Boolean);
defineCloneReturnOriginal(Number);
defineCloneReturnOriginal(String);

setMeta(BigInt, CLONE_METHOD, function(this: BigInt, visited: CloneVisited): BigInt {
  visited.set(this, this);
  return this;
});
setMeta(Symbol, CLONE_METHOD, function(this: Symbol, visited: CloneVisited): Symbol {
  visited.set(this, this);
  return this;
})

function defineErrorOnClone(proto: Constructor): void {
  setMeta(proto, ERROR_ON_CLONE, proto.name);
}

defineErrorOnClone(WeakSet);
defineErrorOnClone(WeakMap);
defineErrorOnClone(WeakRef);

// * Main Clone Function *

/**
 * Creates a deep clone of a provided value. 
 * @param source - The value to be cloned.
 * @returns The cloned value.
 * @public
 */
export function clone<T>(source: T): T {
  return clonecyc(source, new Map());
}

export function clonecyc<T>(source: T, visited: CloneVisited): T {
  if (typeof source === 'object') {
    // Null
    if (source === null) {
      return null as T;
    }
    // Error-On-Clone Objects
    const errorOnClone = getMeta(source, ERROR_ON_CLONE);
    if (typeof errorOnClone === 'string') {
      throw new ValueSemanticsError('ErrorOnClone', errorOnClone);
    }
    // Visited Objects
    if (visited.has(source)) {
      return visited.get(source);
    }
    // Objects with customized clone method (including Return-Original objects)
    const meth = getMeta<Function>(source, CLONE_METHOD);
    if (meth !== META_NOT_FOUND) {
      const target = meth.call(source, visited);
      return target;
    }
    // Generator Objects
    if (isGenerator(source)) {
      throw new ValueSemanticsError('ErrorOnGeneratorClone');
    }
    // Other Object
    const proto = Object.getPrototypeOf(source);
    const target = Object.create(proto);
    visited.set(source, target);
    copyProps(getAllKeys(source), target, source, visited);
    return target;
  }
  return source;
}

// * Clone Customization Decorators *

// Helpers

export const CLONE_SEMANTICS = ['deep', 'iterate', 'returnOriginal', 'errorOnClone'] as const;
export type CloneSemantics = typeof CLONE_SEMANTICS[number];

export type CustomizeCloneOptions = {
  runConstructor?: boolean,
  propDefault?: 'include' | 'exclude'
}

export type IterateCloneOptions = {
  addMethod: PropKey,
  runConstructor?: boolean
}

// Class Decorator

export function customizeClone<C extends Constructor>(options?: CustomizeCloneOptions): ClassDecorator_<C>
export function customizeClone<C extends Constructor>(
  semantics: 'deep', options?: CustomizeCloneOptions
): ClassDecorator_<C>
export function customizeClone<C extends Constructor>(
  semantics: 'iterate', options: IterateCloneOptions
): ClassDecorator_<C>
export function customizeClone<C extends Constructor>(
  semantics: 'returnOriginal' | 'errorOnClone'
): ClassDecorator_<C>
export function customizeClone<C extends Constructor>(
  semanticsOrOpts?: CloneSemantics | CustomizeCloneOptions, options?: CustomizeCloneOptions | IterateCloneOptions
): ClassDecorator_<C> {
  type I = InstanceType<C>;

  const semantics: CloneSemantics = typeof semanticsOrOpts === 'string' ? semanticsOrOpts : 'deep';

  if (!options) {
    if (typeof semanticsOrOpts === 'object') {
      options = semanticsOrOpts;
    } else {
      options = { };
    }
  }
  const opts: Required<CustomizeCloneOptions> = { 
    runConstructor: false, propDefault: 'include', ...options 
  };

  const deepCloneMeth = function(this: I, visited: CloneVisited): I {
    const target = opts.runConstructor ? constructTarget(this) : createTarget(this);
    visited.set(this, target);
    const cloneProps = getKeys(this, opts.propDefault, 'clone', opts.runConstructor);
    copyProps(cloneProps, target, this, visited);
    return target;
  }

  const returnOriginalMeth = function(this: I, visited: CloneVisited): I {
    visited.set(this, this);
    return this;
  }

  function iterateMethBuilder(
    addMethod: PropKey, runConstructor?: boolean
  ): (visited: CloneVisited) => I {
    return function<M>(this: I, visited: CloneVisited): I {
      const target = runConstructor ? constructTarget(this) : createTarget(this);
      visited.set(this, target);
      for (const member of (this as Iterable<M>)) {
        target[addMethod](clonecyc(member, visited));
      }
      return target;
    }
  }

  return function(constructor: C, context: ClassDecoratorContext): void {
    if (semantics === 'iterate') {
      const opts = options as IterateCloneOptions;
      if (!(Symbol.iterator in constructor.prototype)) {
        throw new ValueSemanticsError('IterateNonIterable');
      }
      if (!(opts.addMethod in constructor.prototype)) {
        throw new ValueSemanticsError('IterateNoAddMethod');
      }
      context.metadata[CLONE_METHOD] = iterateMethBuilder(opts.addMethod, opts.runConstructor);
    } else if (semantics === 'returnOriginal') {
      context.metadata[CLONE_METHOD] = returnOriginalMeth;
    } else if (semantics === 'errorOnClone') {
      context.metadata[ERROR_ON_CLONE] = context.name ?? '(Anonymous class)';
    } else {
      const includes = (context.metadata[CLONE_INCLUDE_PROPS] as Set<PropKey>) ?? new Set();
      const excludes = (context.metadata[CLONE_EXCLUDE_PROPS] as Set<PropKey>) ?? new Set();
      if (!includes.isDisjointFrom(excludes)) {
        throw new ValueSemanticsError('IncludeAndExclude');
      }
      context.metadata[CLONE_METHOD] = deepCloneMeth;
    }
  }
}

// Field Decorators

/**
 * Class field decorators which allow the class' `clone` implementations to be customized.
 * @public
 */
export namespace clone {

  export function include<C, V>(
    _target: undefined, context: ClassFieldDecoratorContext<C, V>
  ): void {
    context.metadata[CLONE_INCLUDE_PROPS] ??= new Set();
    (context.metadata[CLONE_INCLUDE_PROPS] as Set<PropKey>).add(context.name);
  }
  
  export function exclude<C, V>(
    _target: undefined, context: ClassFieldDecoratorContext<C, V>
  ): void {
    context.metadata[CLONE_EXCLUDE_PROPS] ??= new Set();
    (context.metadata[CLONE_EXCLUDE_PROPS] as Set<PropKey>).add(context.name);
  }

  export function constructorParam<C, V>(
    _target: undefined, context: ClassFieldDecoratorContext<C, V>
  ): void {
    context.metadata[CONSTRUCTOR_PROPS] ??= [];
    (context.metadata[CONSTRUCTOR_PROPS] as PropKey[]).push(context.name);
  }
}
