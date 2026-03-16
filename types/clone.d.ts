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
 * This decorator can be used to customize the clone implementation of the decorated class.
 * @overload
 * @param options - Options for how to customize the deep clone semantics of this class.
 * @return A decorator which customizes the decorated class' deep clone semantics.
 */
/**
 * This decorator can be used to customize the clone implementation of the decorated class.
 * @overload
 * @param semantics - The kind of clone semantics the class is customized to have.
 * @param options - Options for how to customize the deep clone semantics of this class.
 * @return - A decorator which customizes the decorated class' deep clone semantics.
 */
/**
 * This decorator can be used to customize the clone implementation of the decorated class.
 * @overload
 * @param semantics - The kind of clone semantics the class is customized to have.
 * @param options - Options for how to customize the iterate clone semantics of this class.
 * @return - A decorator which customizes the decorated class' deep clone semantics.
 */
/**
 * This decorator can be used to customize the clone implementation of the decorated class.
 * @overload
 * @param semantics - The kind of clone semantics the class is customized to have.
 * @return - A decorator which customizes the decorated class' deep clone semantics.
 */
/**
 * This decorator can be used to customize the clone implementation of the decorated class.
 * @param semanticsOrOpts - Either the kind of clone semantics the class is customized to have
 *   (defaulting to 'deep'), or options for how to customize the deep clone semantics of this class.
 * @param options - If semantics is specified as either 'deep' or 'iterate', options for how to
 *   customize the clone semantics of this class.
 * @returns - A decorator which customizes the decorated class' deep clone semantics.
 */
export declare function customizeClone<C extends Constructor>(options?: CustomizeCloneOptions): ClassDecorator_<C>;
export declare function customizeClone<C extends Constructor>(semantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<C>;
export declare function customizeClone<C extends Constructor>(semantics: 'iterate', options: IterateCloneOptions): ClassDecorator_<C>;
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
