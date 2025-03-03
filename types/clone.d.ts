import { ClassDecorator, PropKey, CloneVisited } from "./common";
export declare const ERROR_ON_CLONE: unique symbol;
export declare function copyProps<T extends Object>(props: Set<PropKey>, target: T, source: T, visited: CloneVisited): void;
/**
 * Creates a deep clone of a provided value.
 * @param source - The value to be cloned.
 * @returns The cloned value.
 * @public
 */
export declare function clone<T>(source: T): T;
export declare function clonecyc<T>(source: T, visited: CloneVisited): T;
export type CloneSemantics = 'deep' | 'returnOriginal' | 'errorOnClone';
export type CustomizeCloneOptions = {
    runConstructor?: boolean;
    propDefault?: 'include' | 'exclude';
};
export declare function customizeClone<I extends object>(options?: CustomizeCloneOptions): ClassDecorator<I>;
export declare function customizeClone<I extends object>(semantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator<I>;
export declare function customizeClone<I extends object>(semantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator<I>;
/**
 * Class field decorators which allow the class' `clone` implementations to be customized.
 * @public
 */
export declare namespace clone {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function constructorParam<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
