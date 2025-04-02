import { customizeClone, CustomizeCloneOptions } from './clone';
import { ClassDecorator_, ConstructorFunc } from './common';
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
    function value<C extends ConstructorFunc>(options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(// Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(// Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(// Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'ref'): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(// Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(equalsSemantics: 'value', cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends ConstructorFunc>(equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator_<C>;
}
export declare namespace value {
    function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
