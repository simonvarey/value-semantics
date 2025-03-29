// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Common Elements **

// * Customization: Metadata *

// This is only here as a polyfill for engines without decorator metadata.
//@ts-ignore
Symbol.metadata ??= Symbol('Symbol.metadata');

export const META_NOT_FOUND = Symbol.for('meta-not-found');

export function getMeta<T>(target: object, key: PropKey): T | typeof META_NOT_FOUND {
  if ('constructor' in target && Symbol.metadata in target.constructor) {
    const meta = target.constructor[Symbol.metadata];
    if (typeof meta === 'object' && meta && key in meta) {
      return meta[key as keyof typeof meta] as T;
    }
  }
  return META_NOT_FOUND;
}

export function setMeta(
  target: Constructor<unknown> | BigIntConstructor | SymbolConstructor, key: PropKey, value: unknown
): void {
  target[Symbol.metadata] ??= {};
  target[Symbol.metadata]![key] = value;
}

// * Customization: Implementation *

// `TypedArrayConstructor` is needed because of https://github.com/microsoft/TypeScript/issues/60745
type TypedArrays = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | 
  Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;

type TypedArrayConstructor = new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(
  buffer: TArrayBuffer, byteOffset?: number, length?: number
) => TypedArrays;

export const TYPED_ARRAYS: TypedArrayConstructor[] = [
  Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, 
  Float32Array, Float64Array, BigInt64Array, BigUint64Array
];

export const CLONE_METHOD = Symbol.for('clone-method');
export const EQUALS_METHOD = Symbol.for('equals-method');

export type CloneVisited = Map<any, any>;
export type EqualsVisited = Map<object, Map<object, boolean>>;

export type CloneMethodFunc<T> = (this: T, visited: CloneVisited) => T;
export type EqualMethodFunc<T> = (this: T, other: object, visited: EqualsVisited) => boolean;

// * Customization: Class Fields *

export const CLONE_INCLUDE_PROPS = Symbol.for('clone-include-props');
export const CLONE_EXCLUDE_PROPS = Symbol.for('clone-exclude-props');
export const EQUALS_INCLUDE_PROPS = Symbol.for('equals-include-props');
export const EQUALS_EXCLUDE_PROPS = Symbol.for('equals-exclude-props');
export const CONSTRUCTOR_PROPS = Symbol.for('constructor-props');

export type PropKey = string | symbol;

export type PropDefault = 'include' | 'exclude';

export function getAllKeys(source: Object): Set<PropKey> {
  return new Set([...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]);
}

export function getKeys(
  source: object, 
  propDefault: PropDefault,
  deriveKind: 'clone' | 'equals',
  constructor: boolean = false
): Set<PropKey> {
  if (propDefault === 'include') {
    let keys = getAllKeys(source);
    const excludeSymbol = deriveKind === 'clone' ? CLONE_EXCLUDE_PROPS : EQUALS_EXCLUDE_PROPS;
    const excluded = getMeta(source, excludeSymbol);
    if (excluded !== META_NOT_FOUND) {
      keys = keys.difference(excluded as Set<PropKey>);
    }
    if (deriveKind === 'clone') {
      const construct = getMeta(source, CONSTRUCTOR_PROPS);
      if (construct !== META_NOT_FOUND && constructor) {
        for (const key of construct as PropKey[]) {
          keys.delete(key);
        }
      }
      const included = getMeta(source, CLONE_INCLUDE_PROPS);
      if (included !== META_NOT_FOUND) {
        keys = keys.union(included as Set<PropKey>);
      }
    }
    return keys;
  }
  const includeSymbol = deriveKind === 'clone' ? CLONE_INCLUDE_PROPS : EQUALS_INCLUDE_PROPS;
  const included = getMeta(source, includeSymbol);
  if (included !== META_NOT_FOUND) {
    return included as Set<PropKey>;
  }
  return new Set();
}

// * Customization: Decorators *

export type Constructor<Instance> = { new(...args: any[]): Instance; };

export type ClassDecoratorInst<I> = (
  constructor: Constructor<I>, context: ClassDecoratorContext
) => Constructor<I> | void;

export type ClassDecorator_<C> = (
  constructor: C, context: ClassDecoratorContext
) => C | void;

// * Errors *

export type ValueSemanticsErrorType = 'ErrorOnClone' | 'IncludeAndExclude';

export const ERROR_MSGS: Record<ValueSemanticsErrorType, string> = {
  'ErrorOnClone': 'Instances of class % cannot be cloned',
  'IncludeAndExclude': 'A field cannot be decorated with both `@include` and `@exclude`'
}

export class ValueSemanticsError extends Error {
  constructor(public type: ValueSemanticsErrorType, arg: string = '') {
    const msg = ERROR_MSGS[type].replace('%', arg);
    super(msg);
  }
}