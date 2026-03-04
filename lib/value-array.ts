// Copyright 2025 Simon Varey @simonvarey
// Licensed under the MIT license <LICENSE-MIT or http://opensource.org/licenses/MIT>. 
// This file may not be copied, modified, or distributed except according to those terms.

// ** Value Semantics: Value Array **

// * Imports *

import { clone, customizeClone } from './clone';
import { equals } from './equals';

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
  copyWithin(target: number, start: number, end?: number): this {
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

  // equals
  includes(needle: M, fromIndex?: number): boolean {
    fromIndex = normalizeIndexWithDefault(fromIndex, this.length, 0);
    
    for (let idx = fromIndex; idx < this.length; idx++) {
      if (equals(needle, this[idx])) {
        return true;
      }
    }

    return false;
  }

  // equals
  indexOf(needle: M, fromIndex?: number): number {
    if (Number.isNaN(needle)) {
      return -1;
    }

    fromIndex = normalizeIndexWithDefault(fromIndex, this.length, 0);
    
    for (let idx = fromIndex; idx < this.length; idx++) {
      if (equals(needle, this[idx]) && this.hasOwnProperty(idx)) {
        return idx;
      }
    }

    return -1;
  }

  // equals
  lastIndexOf(needle: M, fromIndex?: number): number {
    if (Number.isNaN(needle)) {
      return -1;
    }

    fromIndex = normalizeIndexWithDefaultAndMax(fromIndex, this.length, this.length - 1, this.length - 1);
    
    for (let idx = fromIndex; idx >= 0; idx--) {
      if (equals(needle, this[idx]) && this.hasOwnProperty(idx)) {
        return idx;
      }
    }

    return -1;
  }

  // clone
  splice(start?: number, deleteCount?: number, ...items: M[]): this {
    let editStart = this.length;
    let deletedElements;
    let endElements;
    if (!(start === undefined || start >= this.length)) {
      editStart = normalizeIndex(start, this.length);
      if (editStart !== this.length) {
        let editEnd = editStart;
        if (deleteCount === undefined && items.length === 0) {
          deleteCount = this.length;
        }
        if (deleteCount !== undefined && deleteCount > this.length) {
          deleteCount = this.length;
        }
        if (deleteCount !== undefined && deleteCount > 0) {
          editEnd += deleteCount;
          deletedElements = this.slice(editStart, editEnd)
        }
        endElements = this.slice(editEnd);
        this.length = editStart;
      }
    }
    this.push(...items.map((item) => clone(item)));
    if (endElements) {
      this.push(...endElements)
    }
    const thisConstructor = Object.getPrototypeOf(this).constructor;
    return deletedElements ? new thisConstructor(...deletedElements) : new thisConstructor();
  }

  // clone
  toReversed(): this {
    const reversed = clone(this);
    reversed.reverse();
    return reversed;
  }

  // clone
  toSorted(compareFn?: (a: M, b: M) => number): this {
    const sorted = clone(this);
    sorted.sort(compareFn);
    return sorted;
  }

  // clone
  toSpliced(start?: number, deleteCount?: number, ...items: M[]): this {
    const spliced = clone(this);
    spliced.splice(start, deleteCount, ...items);
    return spliced;
  }

  // clone
  with(index: number, value: M): this {
    if (index < 0) {
      index += this.length;
    }
    if (index < 0 || index >= this.length) {
      throw new RangeError('invalid or out-of-range index');
    }
    const newArray = clone(this);
    newArray[index] = clone(value);
    return newArray;
  }
}

export { ValueArray }
