import { ClassDecorator, EqualsVisited } from "./common";
export declare const REF_EQUALS: unique symbol;
/**
 * Compares two values for value-equality.
 * @param lhs The first value to compare.
 * @param rhs The second value to compare.
 * @returns Whether the two values are value-equal.
 */
export declare function equals(lhs: unknown, rhs: unknown): boolean;
export declare function equalscyc(lhs: unknown, rhs: unknown, visited: EqualsVisited): boolean;
export type EqualsSemantics = 'value' | 'ref';
export type CustomizeEqualsOptions = {
    propDefault?: 'include' | 'exclude';
};
export declare function customizeEquals<I extends object>(options?: CustomizeEqualsOptions): ClassDecorator<I>;
export declare function customizeEquals<I extends object>(semantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator<I>;
export declare function customizeEquals<I extends object>(semantics: 'ref'): ClassDecorator<I>;
export declare namespace equals {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
