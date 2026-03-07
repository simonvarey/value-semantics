// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// * Value-Semantics: The JavaScript/TypeScript Value Semantics Toolkit *

import { customizeClone, clone } from './clone';
import { Constructor } from './common';
import { customizeEquals, equals } from './equals';

export { clone } from './clone';
export { equals } from './equals';
export { ValueArray } from './value-array';

/**
 * Class decorators which allow the class' `equals` and `clone` implementations to be customized.
 * @public
 */
export namespace customize {
  export const clone = customizeClone;
  export const equals = customizeEquals;

  export function value<C extends Constructor>(constructor: C, context: ClassDecoratorContext): void {
    customize.clone()(constructor, context);
    customize.equals()(constructor, context);
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
