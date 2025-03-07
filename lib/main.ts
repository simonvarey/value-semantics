// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// * Value-Semantics: The JavaScript/TypeScript Value Semantics Toolkit *

import { CLONE_SEMANTICS, CloneSemantics, customizeClone, CustomizeCloneOptions } from './clone';
import { ClassDecorator_, Constructor } from './common';
import { customizeEquals, CustomizeEqualsOptions, EQUALS_SEMANTICS, EqualsSemantics } from './equals';

export { clone } from './clone';
export { equals } from './equals';

type CustomizeValueOptions = CustomizeCloneOptions;

/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export namespace customize {
  export const clone = customizeClone;
  export const equals = customizeEquals;

  export function value<I extends object>(options?: CustomizeValueOptions): ClassDecorator_<I> // No Semantics
  export function value<I extends object>( // Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions
  ): ClassDecorator_<I>
  export function value<I extends object>( // Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    equalsSemantics: 'ref', options?: CustomizeCloneOptions
  ): ClassDecorator_<I>
  export function value<I extends object>( // Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    equalsSemantics: 'value', 
    options?: CustomizeEqualsOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    equalsSemantics: 'ref'
  ): ClassDecorator_<I>
  export function value<I extends object>( // Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    equalsSemantics: 'value', 
    cloneSemantics: 'returnOriginal' | 'errorOnClone', 
    options?: CustomizeEqualsOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions
  ): ClassDecorator_<I>
  export function value<I extends object>(
    equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone', 
  ): ClassDecorator_<I>
  export function value<I extends object>( // Overload
    first?: CloneSemantics | EqualsSemantics | CustomizeValueOptions, 
    second?: CloneSemantics | EqualsSemantics | CustomizeValueOptions,
    third?: CustomizeValueOptions
  ): ClassDecorator_<I> {
    return function(constructor: Constructor<I>, context: ClassDecoratorContext): void {
      let cloneSemantics: CloneSemantics = 'deep';
      let equalsSemantics: EqualsSemantics = 'value';
      let opts: CustomizeValueOptions = {};

      if (typeof first === 'string') {
        if (CLONE_SEMANTICS.includes(first as CloneSemantics)) {
          cloneSemantics = first as CloneSemantics;
        }
        if (EQUALS_SEMANTICS.includes(first as EqualsSemantics)) {
          equalsSemantics = first as EqualsSemantics;
        }
      } else if (first) {
        opts = first;
      }

      if (typeof second === 'string') {
        if (CLONE_SEMANTICS.includes(second as CloneSemantics)) {
          cloneSemantics = second as CloneSemantics;
        }
        if (EQUALS_SEMANTICS.includes(second as EqualsSemantics)) {
          equalsSemantics = second as EqualsSemantics;
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
