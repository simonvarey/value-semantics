declare class ValueArray<M> extends Array<M> {
    copyWithin(target: number, start: number, end?: number): typeof this;
    fill(value: M, start?: number, end?: number): this;
    includes(needle: M, fromIndex?: number): boolean;
    indexOf(needle: M, fromIndex?: number): number;
    lastIndexOf(needle: M, fromIndex?: number): number;
}
export { ValueArray };
