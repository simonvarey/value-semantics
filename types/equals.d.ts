import { ClassDecorator_, EqualsVisited } from "./common";
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
export declare const EQUALS_SEMANTICS: readonly ["value", "ref"];
export type EqualsSemantics = typeof EQUALS_SEMANTICS[number];
export type CustomizeEqualsOptions = {
    propDefault?: 'include' | 'exclude';
};
export declare function customizeEquals<I extends object>(options?: CustomizeEqualsOptions): ClassDecorator_<I>;
export declare function customizeEquals<I extends object>(semantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
export declare function customizeEquals<I extends object>(semantics: 'ref'): ClassDecorator_<I>;
/**
 * Class field decorators which allow the class' `equals` implementations to be customized.
 * @public
 */
export declare namespace equals {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
