/**
 * A subclass of `Array` which overrides several `Array` methods with their value-typed equivalents.
 * @public
 */
declare class ValueArray<M> extends Array<M> {
    /**
     * Returns the `this` object after copying a section of the array identified by `start` and `end`
     * to the same array starting at position `target`. Unlike `Array`, `ValueArray` makes a deep copy
     * of the section using `clone`.
     * @param target - If `target` is negative, it is treated as `length+target` where `length` is the
     * length of the array.
     * @param start - If `start` is negative, it is treated as `length+start`. If `end` is negative, it
     * is treated as `length+end`.
     * @param end - If not specified, length of the `this` object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;
    /**
     * Changes all array elements from `start` to `end` index to a static `value` and returns the
     * modified array. Unlike `Array`, `ValueArray` makes a new deep copy of `value` for each array
     * element that is changed.
     * @param value - Value to fill array section with
     * @param start - Index to start filling the array at. If `start` is negative, it is treated as
     * `length+start` where `length` is the length of the array.
     * @param end - Index to stop filling the array at. If `end` is negative, it is treated as
     * `length+end`.
     */
    fill(value: M, start?: number, end?: number): this;
    /**
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * Unlike `Array`, `ValueArray` uses `equals` to compare `needle` to array elements in terms of
     * value equality.
     * @param needle - The element to search for.
     * @param fromIndex - The position in this array at which to begin searching for `needle`.
     */
    includes(needle: M, fromIndex?: number): boolean;
    /**
     * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
     * Unlike `Array`, `ValueArray` uses `equals` to compare `needle` to array elements in terms of
     * value equality.
     * @param needle - The value to locate in the array.
     * @param fromIndex - The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    indexOf(needle: M, fromIndex?: number): number;
    /**
     * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not
     * present. Unlike `Array`, `ValueArray` uses `equals` to compare `needle` to array elements in
     * terms of value equality.
     * @param needle - The value to locate in the array.
     * @param fromIndex - The array index at which to begin searching backward. If fromIndex is omitted,
     * the search starts at the last index in the array.
     */
    lastIndexOf(needle: M, fromIndex?: number): number;
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place,
     * returning the deleted elements. Unlike `Array`, `ValueArray` makes a new deep copy of
     * each member of `items` which is added to the array using `clone`.
     * @param start - The zero-based location in the array from which to start removing elements.
     * @param deleteCount - The number of elements to remove. If value of this argument is either a
     * negative number, zero, undefined, or a type that cannot be converted to an integer, the
     * function will evaluate the argument as zero and not remove any elements.
     * @param items - Elements to insert into the array in place of the deleted elements.
     * @returns An array containing the elements that were deleted.
     */
    splice(start?: number, deleteCount?: number, ...items: M[]): this;
    /**
     * Returns a copy of an array with its elements reversed. Unlike `Array`, `ValueArray` returns
     * a deep copy of the array using `clone`.
     */
    toReversed(): this;
    /**
     * Returns a copy of an array with its elements sorted. Unlike `Array`, `ValueArray` returns
     * a deep copy of the array using `clone`.
     * @param compareFn - Function used to determine the order of the elements. It is expected to
     * return a negative value if the first argument is less than the second argument, zero if
     * they're equal, and a positive value otherwise. If omitted, the elements are sorted in
     * ascending, UTF-16 code unit order.
     * ```ts
     * [11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]
     * ```
     */
    toSorted(compareFn?: (a: M, b: M) => number): this;
    /**
     * Copies an array and removes elements and, if necessary, inserts new elements in their place.
     * Returns the copied array. Unlike `Array`, `ValueArray` returns a deep copy of the array using
     * `clone`.
     * @param start - The zero-based location in the array from which to start removing elements.
     * @param deleteCount - The number of elements to remove.
     * @param items - Elements to insert into the copied array in place of the deleted elements.
     * @returns The copied array.
     */
    toSpliced(start?: number, deleteCount?: number, ...items: M[]): this;
    /**
     * Copies an array, then overwrites the value at the provided index with the given value. If the
     * index is negative, then it replaces from the end of the array. Unlike `Array`, `ValueArray`
     * returns a deep copy of the array, as well as a deep copy of `value`, using `clone`.
     * @param index - The index of the value to overwrite. If the index is negative, then it replaces
     * from the end of the array.
     * @param value - The value to write into the copied array.
     * @returns The copied array with the updated value.
     */
    with(index: number, value: M): this;
}
export { ValueArray };
