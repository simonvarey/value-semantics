import { EqualsVisited, ConstructorFunc, ClassDecorator_ } from "./common";
export declare const REF_EQUALS: unique symbol;
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
export declare function customizeEquals<C extends ConstructorFunc>(options?: CustomizeEqualsOptions): ClassDecorator_<C>;
export declare function customizeEquals<C extends ConstructorFunc>(semantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
export declare function customizeEquals<C extends ConstructorFunc>(semantics: 'ref'): ClassDecorator_<C>;
export declare function customizeEquals<C extends ConstructorFunc>(semantics: 'iterate'): ClassDecorator_<C>;
/**
 * Class field decorators which allow the class' `equals` implementations to be customized.
 * @public
 */
export declare namespace equals {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
