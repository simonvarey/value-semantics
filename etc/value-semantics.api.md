## API Report File for "value-semantics"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function clone<T>(source: T): T;

// @public
export namespace clone {
    // (undocumented)
    export function constructorParam<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    // (undocumented)
    export function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    // (undocumented)
    export function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}

// @public
export namespace customize {
    const // Warning: (ae-forgotten-export) The symbol "customizeClone" needs to be exported by the entry point main.d.ts
    //
    // (undocumented)
    clone: typeof customizeClone;
    const // Warning: (ae-forgotten-export) The symbol "customizeEquals" needs to be exported by the entry point main.d.ts
    //
    // (undocumented)
    equals: typeof customizeEquals;
    // Warning: (ae-forgotten-export) The symbol "CustomizeValueOptions" needs to be exported by the entry point main.d.ts
    // Warning: (ae-forgotten-export) The symbol "ClassDecorator_" needs to be exported by the entry point main.d.ts
    //
    // (undocumented)
    export function value<I extends object>(options?: CustomizeValueOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(// Clone Semantics
    cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<I>;
    // Warning: (ae-forgotten-export) The symbol "CustomizeEqualsOptions" needs to be exported by the entry point main.d.ts
    //
    // (undocumented)
    export function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(// Equals Semantics
    equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<I>;
    // Warning: (ae-forgotten-export) The symbol "CustomizeCloneOptions" needs to be exported by the entry point main.d.ts
    //
    // (undocumented)
    export function value<I extends object>(equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(// Clone then Equals Semantics
    cloneSemantics: 'deep', equalsSemantics: 'value', options?: CustomizeValueOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(cloneSemantics: 'deep', equalsSemantics: 'ref', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'value', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(cloneSemantics: 'returnOriginal' | 'errorOnClone', equalsSemantics: 'ref'): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(// Equals then Clone Semantics
    equalsSemantics: 'value', cloneSemantics: 'deep', options?: CustomizeValueOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(equalsSemantics: 'value', cloneSemantics: 'returnOriginal' | 'errorOnClone', options?: CustomizeEqualsOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(equalsSemantics: 'ref', cloneSemantics: 'deep', options?: CustomizeCloneOptions): ClassDecorator_<I>;
    // (undocumented)
    export function value<I extends object>(equalsSemantics: 'ref', cloneSemantics: 'returnOriginal' | 'errorOnClone'): ClassDecorator_<I>;
}

// @public
export function equals(lhs: unknown, rhs: unknown): boolean;

// @public
export namespace equals {
    // (undocumented)
    export function exclude<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    // (undocumented)
    export function include<C, V>(_target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}

// @public (undocumented)
export namespace value {
    // (undocumented)
    export function exclude<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
    // (undocumented)
    export function include<C, V>(target: undefined, context: ClassFieldDecoratorContext<C, V>): void;
}

// (No @packageDocumentation comment for this package)

```
