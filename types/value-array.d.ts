declare class ValueArray<M> extends Array<M> {
    copyWithin(target: number, start: number, end?: number): this;
    fill(value: M, start?: number, end?: number): this;
    includes(needle: M, fromIndex?: number): boolean;
    indexOf(needle: M, fromIndex?: number): number;
    lastIndexOf(needle: M, fromIndex?: number): number;
    splice(start?: number, deleteCount?: number, ...items: M[]): this;
    toReversed(): this;
    toSorted(compareFn?: (a: M, b: M) => number): this;
    toSpliced(start?: number, deleteCount?: number, ...items: M[]): this;
    with(index: number, value: M): this;
}
export { ValueArray };
