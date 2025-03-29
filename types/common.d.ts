export declare const META_NOT_FOUND: unique symbol;
export declare function getMeta<T>(target: object, key: PropKey): T | typeof META_NOT_FOUND;
export declare function setMeta(target: ConstructorFunc | BigIntConstructor | SymbolConstructor, key: PropKey, value: unknown): void;
type TypedArrays = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
type TypedArrayConstructor = new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number) => TypedArrays;
export declare const TYPED_ARRAYS: TypedArrayConstructor[];
export declare const CLONE_METHOD: unique symbol;
export declare const EQUALS_METHOD: unique symbol;
export type CloneVisited = Map<any, any>;
export type EqualsVisited = Map<object, Map<object, boolean>>;
export type CloneMethodFunc<T> = (this: T, visited: CloneVisited) => T;
export type EqualMethodFunc<T> = (this: T, other: object, visited: EqualsVisited) => boolean;
export declare const CLONE_INCLUDE_PROPS: unique symbol;
export declare const CLONE_EXCLUDE_PROPS: unique symbol;
export declare const EQUALS_INCLUDE_PROPS: unique symbol;
export declare const EQUALS_EXCLUDE_PROPS: unique symbol;
export declare const CONSTRUCTOR_PROPS: unique symbol;
export type PropKey = string | symbol;
export type PropDefault = 'include' | 'exclude';
export declare function getAllKeys(source: Object): Set<PropKey>;
export declare function getKeys(source: object, propDefault: PropDefault, deriveKind: 'clone' | 'equals', constructor?: boolean): Set<PropKey>;
export type Constructor<Instance> = {
    new (...args: any[]): Instance;
};
export type ConstructorFunc = abstract new (...args: any) => any;
export type ClassDecorator_<C> = (constructor: C, context: ClassDecoratorContext) => C | void;
export type ValueSemanticsErrorType = 'ErrorOnClone' | 'IncludeAndExclude';
export declare const ERROR_MSGS: Record<ValueSemanticsErrorType, string>;
export declare class ValueSemanticsError extends Error {
    type: ValueSemanticsErrorType;
    constructor(type: ValueSemanticsErrorType, arg?: string);
}
export {};
