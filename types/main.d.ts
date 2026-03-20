/**
 * * Value-Semantics: The JavaScript/TypeScript Value Semantics Toolkit *
 *
 * @remarks
 * Everything you need to program as if objects in JavaScript had value semantics, including
 * comprehensive and highly customizable deep cloning {@link clone} and value equality {@link equals}
 * functions, and arrays with value semantics {@link ValueArray}.
 *
 * @packageDocumentation
 */
import { customizeClone } from './clone';
import { customizeEquals } from './equals';
export { clone } from './clone';
export { equals } from './equals';
export { ValueArray } from './value-array';
/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export declare namespace customize {
    const clone: typeof customizeClone;
    const equals: typeof customizeEquals;
}
/**
 * Class field decorators which allow fields to be included or excluded from both `equals` and
 *   `clone` implementations simultaneously.
 * @public
 */
export declare namespace value {
    /**
     * This class field decorator declares a property to be included for both cloning and equality
     * comparison.
     */
    function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    /**
     * This class field decorator declares a property to be excluded for both cloning and equality
     * comparison.
     */
    function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
