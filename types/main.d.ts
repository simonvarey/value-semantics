import { customizeClone, CustomizeCloneOptions } from './clone';
import { ClassDecorator_ } from './common';
import { customizeEquals, CustomizeEqualsOptions } from './equals';
export { clone } from './clone';
export { equals } from './equals';
type CustomizeValueOptions = CustomizeCloneOptions;
/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export declare namespace customize {
    const clone: typeof customizeClone;
    const equals: typeof customizeEquals;
    function value<I extends object>(options?: CustomizeValueOptions): ClassDecorator_<I>;
    function value<I extends object>(// Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<I>;
    function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    function value<I extends object>(// Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<I>;
    function value<I extends object>(equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    function value<I extends object>(// Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<I>;
    function value<I extends object>(cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'ref'): ClassDecorator_<I>;
    function value<I extends object>(// Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<I>;
    function value<I extends object>(equalsSemantics: 'value', cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    function value<I extends object>(equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    function value<I extends object>(equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator_<I>;
}
export declare namespace value {
    function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
