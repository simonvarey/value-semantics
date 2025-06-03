// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Value Array **

// * Imports *

import { clone, customizeClone } from "./clone";

// * Types *

type FlatArray<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer InnerArr> 
    ? FlatArray<
        InnerArr, 
        [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]
      >
    : Arr;
}[Depth extends -1 ? 'done' : 'recur'];

declare global {
  interface Array<T> {
    flat<A extends Array<T>, D extends number = 1>(
      this: A,
      depth?: D,
    ): FlatArray<A, D>[];
  }
}

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

// Based on https://github.com/ljharb/es-abstract/blob/main/2024/FlattenIntoArray.js which is MIT licenced
function flattenIntoArray<M, A extends Array<M>, B extends Array<M>>(
  target: A, source: B, sourceLen: number, start: number, depth: number
): number {
	let targetIndex = start;
	let sourceIndex = 0;
	while (sourceIndex < sourceLen) {
		if (sourceIndex.toString() in source) {
			const element = source[sourceIndex];
			if (depth > 0 && Array.isArray(element)) {
				targetIndex = flattenIntoArray(target, element, element.length, targetIndex, depth - 1);
			} else {
				/*if (targetIndex >= MAX_SAFE_INTEGER) {
					throw new $TypeError('index too large');
				}*/
        target[sourceIndex] = element;
				targetIndex += 1;
			}
		}
		sourceIndex += 1;
	}

	return targetIndex;
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

  // clone
  fill(value: M, start?: number, end?: number): this {
    start = normalizeIndexWithDefaultAndMax(start, this.length, 0, this.length);
    end = normalizeIndexWithDefaultAndMax(end, this.length, this.length, this.length);
    if (end <= start) {
      return this;
    }

    for (let idx = start; idx < end; idx++) {
      this[idx] = clone(value);
    }

    return this;
  }

  // Based on https://github.com/es-shims/Array.prototype.flat/blob/main/implementation.js which is 
  //   MIT licenced
  flat<A extends Array<M>, D extends number = 1>(
    this: A,
    depth?: D
  ): ValueArray<FlatArray<A, D>> {
    const target = new ValueArray<FlatArray<A, D>>();
	  flattenIntoArray(target, this, this.length, 0, depth ?? (1 as D));
	  return target;
  }
}

export { ValueArray }