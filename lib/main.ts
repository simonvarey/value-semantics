// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// * Value-Semantics: The JavaScript/TypeScript Value Semantics Toolkit *

import { customizeClone } from './clone';
import { customizeEquals } from './equals';

export { clone } from './clone';
export { equals } from './equals';

export namespace customize {
  export const clone = customizeClone;
  export const equals = customizeEquals;
}
