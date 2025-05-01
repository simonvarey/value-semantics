// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Value Array **

import { customizeClone } from "./clone";

@customizeClone('iterate', { runConstructor: true, addMethod: 'push' }) 
class ValueArray<M> extends Array<M> { }

export { ValueArray }