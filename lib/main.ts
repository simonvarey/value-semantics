// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// * Value-Semantics: The JavaScript/TypeScript Value Semantics Toolkit *

import { CLONE_SEMANTICS, CloneSemantics, customizeClone, CustomizeCloneOptions, clone } from './clone';
import { ClassDecorator_, ConstructorFunc } from './common';
import { customizeEquals, CustomizeEqualsOptions, EQUALS_SEMANTICS, EqualsSemantics, equals } from './equals';

export { clone } from './clone';
export { equals } from './equals';

type CustomizeValueOptions = CustomizeCloneOptions;

type CloneSemanticsWOIterate = 'deep' | 'returnOriginal' | 'errorOnClone';
type EqualsSemanticsWOIterate = 'value' | 'ref';

/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export namespace customize {
  export const clone = customizeClone;
  export const equals = customizeEquals;

  export function value<C extends ConstructorFunc>(options?: CustomizeValueOptions): ClassDecorator_<C> // No Semantics
  export function value<C extends ConstructorFunc>( // Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>( // Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    equalsSemantics: 'ref', options?: CustomizeCloneOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>( // Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    equalsSemantics: 'value', 
    options?: CustomizeEqualsOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    equalsSemantics: 'ref'
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>( // Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    equalsSemantics: 'value', 
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    options?: CustomizeEqualsOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>(
    equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone', 
  ): ClassDecorator_<C>
  export function value<C extends ConstructorFunc>( // Overload
    first?: CloneSemanticsWOIterate | EqualsSemanticsWOIterate | CustomizeValueOptions, 
    second?: CloneSemanticsWOIterate | EqualsSemanticsWOIterate | CustomizeValueOptions,
    third?: CustomizeValueOptions
  ): ClassDecorator_<C> {
    return function(constructor: C, context: ClassDecoratorContext): void {
      let cloneSemantics: CloneSemanticsWOIterate = 'deep';
      let equalsSemantics: EqualsSemanticsWOIterate = 'value';
      let opts: CustomizeValueOptions = {};

      if (typeof first === 'string') {
        if (CLONE_SEMANTICS.includes(first as CloneSemanticsWOIterate)) {
          cloneSemantics = first as CloneSemanticsWOIterate;
        }
        if (EQUALS_SEMANTICS.includes(first as EqualsSemanticsWOIterate)) {
          equalsSemantics = first as EqualsSemanticsWOIterate;
        }
      } else if (first) {
        opts = first;
      }

      if (typeof second === 'string') {
        if (CLONE_SEMANTICS.includes(second as CloneSemanticsWOIterate)) {
          cloneSemantics = second as CloneSemanticsWOIterate;
        }
        if (EQUALS_SEMANTICS.includes(second as EqualsSemanticsWOIterate)) {
          equalsSemantics = second as EqualsSemanticsWOIterate;
        }
      } else if (second) {
        opts = second;
      }

      if (third) {
        opts = third;
      }

      const cloneOpts: CustomizeCloneOptions = { 
        runConstructor: false, 
        propDefault: 'include',
        ...opts 
      };
      const equalsOpts: CustomizeEqualsOptions = { 
        propDefault: 'include',
        ...opts
      };

      if (cloneSemantics === 'deep') {
        customize.clone('deep', cloneOpts)(constructor, context);
      } else {
        customize.clone(cloneSemantics)(constructor, context);
      }

      if (equalsSemantics === 'value') {
        customize.equals('value', equalsOpts)(constructor, context);
      } else {
        customize.equals(equalsSemantics)(constructor, context);
      }
    }
  }
}

export namespace value {

  export function include<C, V>(
    target: undefined, context: ClassFieldDecoratorContext<C, V>
  ): void {
    clone.include(target, context);
    equals.include(target, context);
  }

  export function exclude<C, V>(
    target: undefined, context: ClassFieldDecoratorContext<C, V>
  ): void {
    clone.exclude(target, context);
    equals.exclude(target, context);
  }

}
