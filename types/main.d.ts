import { customizeClone } from './clone';
import { Constructor } from './common';
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
    function value<C extends Constructor>(constructor: C, context: ClassDecoratorContext): void;
}
export declare namespace value {
    function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
