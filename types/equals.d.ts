import { EqualsVisited, Constructor, ClassDecorator_ } from "./common";
export declare const REF_EQUALS: unique symbol;
declare const WRAPPED_PRIMITIVE_CONSTRUCTORS: (SymbolConstructor | BigIntConstructor | BooleanConstructor | NumberConstructor | StringConstructor)[];
type WrappedPrimitive = typeof WRAPPED_PRIMITIVE_CONSTRUCTORS[number];
export declare function isWrappedPrimSubtype(obj: object): obj is WrappedPrimitive;
/**
 * Compares two values for value-equality.
 * @param lhs - The first value to compare.
 * @param rhs - The second value to compare.
 * @returns Whether the two values are value-equal.
 * @public
 */
export declare function equals(lhs: unknown, rhs: unknown): boolean;
export declare function equalscyc(lhs: unknown, rhs: unknown, visited: EqualsVisited): boolean;
export declare const EQUALS_SEMANTICS: readonly ["value", "ref", "iterate"];
export type EqualsSemantics = typeof EQUALS_SEMANTICS[number];
export type CustomizeEqualsOptions = {
    propDefault?: 'include' | 'exclude';
};
export declare function customizeEquals<C extends Constructor>(options?: CustomizeEqualsOptions): ClassDecorator_<C>;
export declare function customizeEquals<C extends Constructor>(semantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
export declare function customizeEquals<C extends Constructor>(semantics: 'ref'): ClassDecorator_<C>;
export declare function customizeEquals<C extends Constructor>(semantics: 'iterate'): ClassDecorator_<C>;
/**
 * Class field decorators which allow the class' `equals` implementations to be customized.
 * @public
 */
export declare namespace equals {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
export {};
