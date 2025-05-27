// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Value Array **

// * Imports *

import { clone, customizeClone } from "./clone";

// * Helpers *

function normalizeIndex(idx: number, length: number): number {
  if (idx < -length) {
    return 0;
  }
  if (idx < 0) {
    return idx + length;
  }
  return idx;
}

function normalizeIndexWithDefault(idx: number | undefined, length: number, default_: number): number {
  return normalizeIndex(idx ?? default_, length);
}

function normalizeIndexWithDefaultAndMax(
  idx: number | undefined, length: number, default_: number, max: number
): number {
  return Math.min(normalizeIndexWithDefault(idx, length, default_), max);
}

// * Main Class *

@customizeClone('iterate', { runConstructor: true, addMethod: 'push' }) 
class ValueArray<M> extends Array<M> {

  // clone
  copyWithin(target: number, start: number, end?: number): typeof this {
    if (target >= this.length) {
      return this;
    }
    if (start >= this.length) {
      return this;
    }
    const targetStart = normalizeIndex(target, this.length);
    const sourceStart = normalizeIndex(start, this.length);
    const sourceEnd = normalizeIndexWithDefaultAndMax(end, this.length, this.length, this.length);
    if (sourceEnd <= sourceStart) {
      return this;
    }
    const targetEnd = Math.min(targetStart + (sourceEnd - sourceStart), this.length);
  
    // Collect elements to be copied
    const source = [];
    for (
      let sourceIdx = sourceStart, sourceOffset = 0; 
      sourceIdx < sourceEnd; 
      sourceIdx++, sourceOffset++
    ) {
      source[sourceOffset] = clone(this[sourceIdx]);
    }

    // Copy over collected elements
    for (
      let targetIdx = targetStart, targetOffset = 0; 
      targetIdx < targetEnd; 
      targetIdx++, targetOffset++
    ) {
      this[targetIdx] = source[targetOffset];
    }
    return this;
  }
}

export { ValueArray }