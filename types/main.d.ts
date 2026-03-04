import { customizeClone, CustomizeCloneOptions } from './clone';
import { ClassDecorator_, Constructor } from './common';
import { customizeEquals, CustomizeEqualsOptions } from './equals';
export { clone } from './clone';
export { equals } from './equals';
export { ValueArray } from './value-array';
type CustomizeValueOptions = CustomizeCloneOptions;
/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export declare namespace customize {
    const clone: typeof customizeClone;
    const equals: typeof customizeEquals;
    function value<C extends Constructor>(options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(// Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(// Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(// Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'ref'): ClassDecorator_<C>;
    function value<C extends Constructor>(// Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(equalsSemantics: 'value', cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<C>;
    function value<C extends Constructor>(equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator_<C>;
}
export declare namespace value {
    function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}
