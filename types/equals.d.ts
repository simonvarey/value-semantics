import { EqualsVisited, Constructor, ClassDecorator_ } from './common';
export declare const REF_EQUALS: unique symbol;
declare const WRAPPER_OBJECT_CONSTRUCTORS: (SymbolConstructor | BigIntConstructor | BooleanConstructor | NumberConstructor | StringConstructor)[];
type WrapperObject = typeof WRAPPER_OBJECT_CONSTRUCTORS[number];
export declare function isPrimitiveWrapper(obj: object): obj is WrapperObject;
export declare function isWrapperObject(obj: unknown): obj is WrapperObject;
/**
 * Compares two values for value-equality.
 * @param lhs - The first value to compare.
 * @param rhs - The second value to compare.
 * @returns Whether the two values are value-equal.
 * @public
 */
export declare function equals(lhs: unknown, rhs: unknown): boolean;
export declare function equalscyc(lhs: unknown, rhs: unknown, visited: EqualsVisited): boolean;
type CustomizeEqualsOptions = {
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
