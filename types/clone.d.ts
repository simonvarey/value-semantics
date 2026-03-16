import { PropKey, CloneVisited, ClassDecorator_, Constructor } from './common';
export declare function copyProps<T extends Object>(props: Set<PropKey>, target: T, source: T, visited: CloneVisited): void;
/**
 * Creates a deep clone of a provided value.
 * @param source - The value to be cloned.
 * @returns The cloned value.
 * @public
 */
export declare function clone<T>(source: T): T;
export declare function clonecyc<T>(source: T, visited: CloneVisited): T;
type CustomizeCloneOptions = {
    runConstructor?: boolean;
    propDefault?: 'include' | 'exclude';
};
export type IterateCloneOptions = {
    addMethod: PropKey;
    runConstructor?: boolean;
};
/**
 * This decorator can be used to set the clone semantics of the decorated class to the default
 *   value of 'deep', and to further customize the class' clone semantics.
 * @param options - Options for how to further customize the deep clone semantics of this class.
 * @returns A decorator which customizes the decorated class' clone semantics.
 */
export declare function customizeClone<C extends Constructor>(options?: CustomizeCloneOptions): ClassDecorator_<C>;
/**
 * This decorator can be used to set the clone semantics of the decorated class to 'deep', and
 *   to further customize the class' clone semantics.
 * @param semantics - The kind of clone semantics the class is customized to have, specifically 'deep'.
 * @param options - Options for how to further customize the clone semantics of this class.
 * @returns A decorator which customizes the decorated class' clone semantics.
 */
export declare function customizeClone<C extends Constructor>(semantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<C>;
/**
 * This decorator can be used to set the clone semantics of the decorated class to 'iterate', and
 *   to further customize the class' clone semantics.
 * @param semantics - The kind of clone semantics the class is customized to have, specifically
 *   'iterate'.
 * @param options - Options for how to further customize the clone semantics of this class.
 * @returns A decorator which customizes the decorated class' clone semantics.
 */
export declare function customizeClone<C extends Constructor>(semantics: 'iterate', options: IterateCloneOptions): ClassDecorator_<C>;
/**
 * This decorator can be used to set the clone semantics of the decorated class to either
 *   'returnOriginal' or 'errorOnClone'.
 * @param semantics - The kind of clone semantics the class is customized to have, either
 *   'returnOriginal' or 'errorOnClone'.
 * @returns A decorator which customizes the decorated class' clone semantics.
 */
export declare function customizeClone<C extends Constructor>(semantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator_<C>;
/**
 * Class field decorators which allow the class' `clone` implementations to be customized.
 * @public
 */
export declare namespace clone {
    function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function constructorParam<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
export {};
