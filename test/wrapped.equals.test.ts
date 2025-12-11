import { expect, test } from 'vitest';
import { customize, equals } from '../lib/main';
import { isWrappedPrimitive, isWrappedPrimSubtype } from '../lib/equals';

test('equating wrapped booleans', () => {
  // Wrapped Booleans
  expect(equals(true, new Boolean(true))).toBeTruthy();
  expect(equals(new Boolean(true), true)).toBeTruthy();
  expect(equals(new Boolean(true), new Boolean(true))).toBeTruthy();

  // Boolean Subclass
  class BooleanSub extends Boolean { }
  const boolSub1 = new BooleanSub(false);
  const boolSub2 = new BooleanSub(false);
  const boolSub3 = new BooleanSub(true);
  expect(equals(boolSub1, boolSub1)).toBeTruthy();
  expect(equals(boolSub1, boolSub2)).toBeTruthy();
  expect(equals(boolSub1, boolSub3)).toBeFalsy();
  expect(equals(boolSub1, false)).toBeFalsy();
  expect(equals(false, boolSub1)).toBeFalsy();

  // Ref Equals Boolean Subclass
  @customize.equals('ref')
  class BooleanRefSub extends Boolean { }
  const boolRef1 = new BooleanRefSub(false);
  const boolRef2 = new BooleanRefSub(false);
  const boolRef3 = new BooleanRefSub(true);
  expect(equals(boolRef1, boolRef1)).toBeTruthy();
  expect(equals(boolRef1, boolRef2)).toBeFalsy();
  expect(equals(boolRef1, boolRef3)).toBeFalsy();
  expect(equals(boolRef1, false)).toBeFalsy();
  expect(equals(false, boolRef1)).toBeFalsy();

  // Value Equals Boolean Subclass
  @customize.equals('value')
  class BooleanValueSub extends Boolean { }
  const boolVal1 = new BooleanValueSub(false);
  const boolVal2 = new BooleanValueSub(false);
  const boolVal3 = new BooleanValueSub(true);
  expect(equals(boolVal1, boolVal1)).toBeTruthy();
  expect(equals(boolVal1, boolVal2)).toBeTruthy();
  expect(equals(boolVal1, boolVal3)).toBeFalsy();
  expect(equals(boolVal1, false)).toBeFalsy();
  expect(equals(false, boolVal1)).toBeFalsy();

  // Boolean Wrapper and Subwrapper Objects
  const wrapper = Object(true);
  expect(wrapper instanceof Boolean).toBeTruthy();
  expect(isWrappedPrimitive(wrapper)).toBeTruthy();
  expect(equals(wrapper, true)).toBeTruthy();
  expect(equals(true, wrapper)).toBeTruthy();
  const subwrapper = Object.create(Object(true), { field: { value: 0 } });
  expect(subwrapper instanceof Boolean).toBeTruthy();
  expect(isWrappedPrimitive(subwrapper)).toBeFalsy();
  expect(equals(subwrapper, true)).toBeFalsy();
  expect(equals(true, subwrapper)).toBeFalsy();
  expect(equals(subwrapper, wrapper)).toBeFalsy();
  expect(equals(wrapper, subwrapper)).toBeFalsy();
})

test('equating wrapped numbers', () => {
  // Wrapped Numbers
  expect(equals(1, new Number(1))).toBeTruthy();
  expect(equals(new Number(1), 1)).toBeTruthy();
  expect(equals(new Number(1), new Number(1))).toBeTruthy();
  expect(equals(new Number(NaN), new Number(NaN))).toBeTruthy();
  expect(equals(NaN, new Number(NaN))).toBeTruthy();
  expect(equals(new Number(NaN), NaN)).toBeTruthy();

  // Number Subclass
  class NumberSub extends Number { }
  const numberSub1 = new NumberSub(0);
  const numberSub2 = new NumberSub(0);
  const numberSub3 = new NumberSub(1);
  expect(equals(numberSub1, numberSub1)).toBeTruthy();
  expect(equals(numberSub1, numberSub2)).toBeTruthy();
  expect(equals(numberSub1, numberSub3)).toBeFalsy();
  expect(equals(numberSub1, 0)).toBeFalsy();
  expect(equals(0, numberSub1)).toBeFalsy();

  // Ref Equals Number Subclass
  @customize.equals('ref')
  class BooleanNumberSub extends Number { }
  const numRef1 = new BooleanNumberSub(0);
  const numRef2 = new BooleanNumberSub(0);
  const numRef3 = new BooleanNumberSub(1);
  expect(equals(numRef1, numRef1)).toBeTruthy();
  expect(equals(numRef1, numRef2)).toBeFalsy();
  expect(equals(numRef1, numRef3)).toBeFalsy();
  expect(equals(numRef1, 0)).toBeFalsy();
  expect(equals(0, numRef1)).toBeFalsy();

  // Value Equals Number Subclass
  @customize.equals('value')
  class NumberValueSub extends Number { }
  const numVal1 = new NumberValueSub(0);
  const numVal2 = new NumberValueSub(0);
  const numVal3 = new NumberValueSub(1);
  expect(equals(numVal1, numVal1)).toBeTruthy();
  expect(equals(numVal1, numVal2)).toBeTruthy();
  expect(equals(numVal1, numVal3)).toBeFalsy();
  expect(equals(numVal1, 0)).toBeFalsy();
  expect(equals(0, numVal1)).toBeFalsy();
})

test('equating wrapped string', () => {
  // Wrapped String
  expect(equals('a', new String('a'))).toBeTruthy();
  expect(equals(new String('a'), 'a')).toBeTruthy();
  expect(equals(new String('a'), new String('a'))).toBeTruthy();

  // String Subclass
  class StringSub extends String { }
  const stringSub1 = new StringSub('a');
  const stringSub2 = new StringSub('a');
  const stringSub3 = new StringSub('b');
  expect(equals(stringSub1, stringSub1)).toBeTruthy();
  expect(equals(stringSub1, stringSub2)).toBeTruthy();
  expect(equals(stringSub1, stringSub3)).toBeFalsy();
  expect(equals(stringSub1, 'a')).toBeFalsy();
  expect(equals('a', stringSub1)).toBeFalsy();

  // Ref Equals String Subclass
  @customize.equals('ref')
  class StringRefSub extends String { }
  const numRef1 = new StringRefSub('a');
  const numRef2 = new StringRefSub('a');
  const numRef3 = new StringRefSub('b');
  expect(equals(numRef1, numRef1)).toBeTruthy();
  expect(equals(numRef1, numRef2)).toBeFalsy();
  expect(equals(numRef1, numRef3)).toBeFalsy();
  expect(equals(numRef1, 'a')).toBeFalsy();
  expect(equals('a', numRef1)).toBeFalsy();

  // Value Equals String Subclass
  @customize.equals('value')
  class StringValueSub extends String { }
  const stringVal1 = new StringValueSub('a');
  const stringVal2 = new StringValueSub('a');
  const stringVal3 = new StringValueSub('b');
  expect(equals(stringVal1, stringVal1)).toBeTruthy();
  expect(equals(stringVal1, stringVal2)).toBeTruthy();
  expect(equals(stringVal1, stringVal3)).toBeFalsy();
  expect(equals(stringVal1, 'a')).toBeFalsy();
  expect(equals('a', stringVal1)).toBeFalsy();
})

test('equating wrapped symbols', () => {
  // Wrapped Symbols
  const sym = Symbol();
  expect(Object(sym).valueOf() === sym).toBeTruthy();
  expect(equals(sym, Object(sym))).toBeTruthy();
  expect(equals(Object(sym), sym)).toBeTruthy();
  expect(equals(Object(sym), Object(sym))).toBeTruthy();

  // Wrapped Symbols For
  const sym1 = Symbol.for('test');
  const sym2 = Symbol.for('test');
  const sym3 = Symbol();
  expect(equals(sym1, Object(sym2))).toBeTruthy();
  expect(equals(Object(sym2), sym1)).toBeTruthy();
  expect(equals(Object(sym1), Object(sym2))).toBeTruthy();
  expect(equals(Object(sym1), Object(sym3))).toBeFalsy();

  // Symbol Subclass
  const WrappedSymbolProto = Object.getPrototypeOf(Object(Symbol()));

  const SubSymbolProto = Object.create(WrappedSymbolProto, {
    valueOf: {
      value: function() { return this.sym }
    },
    sym: {
      value: Symbol()
    }
  });

  function SubSym(sym: Symbol) {
    return Object.create(SubSymbolProto, {
      sym: {
        value: sym
      }
    });
  }

  const sym4 = Symbol();
  const symSub4a = SubSym(sym4);
  const symSub4b = SubSym(sym4);
  const symSub5 = SubSym(Symbol());
  expect(symSub4a instanceof Symbol).toBeTruthy();
  expect(symSub4a.valueOf() === sym4).toBeTruthy();
  expect(isWrappedPrimSubtype(symSub4a)).toBeTruthy();
  expect(equals(symSub4a, symSub4a)).toBeTruthy();
  expect(equals(symSub4a, symSub4b)).toBeTruthy();
  expect(equals(symSub4a, symSub5)).toBeFalsy();
  expect(equals(symSub4a, Object(sym4))).toBeFalsy();
  expect(equals(Object(sym4), symSub4a)).toBeFalsy();

  // Symbol Subclass with Different Equals Semantics
  function DiffSubSym(sym: Symbol, field: string) {
    return Object.create(SubSymbolProto, {
      sym: {
        value: sym
      },
      field: {
        value: field
      }
    });
  }

  const sym6 = Symbol();
  const diffSymSub6a = DiffSubSym(sym6, 'a');
  const diffSymSub6aa = DiffSubSym(sym6, 'a');
  const diffSymSub7 = DiffSubSym(sym6, 'b');
  expect(diffSymSub6a instanceof Symbol).toBeTruthy();
  expect(diffSymSub6a.valueOf() === sym6).toBeTruthy();
  expect(isWrappedPrimSubtype(diffSymSub6a)).toBeTruthy();
  expect(equals(diffSymSub6a, diffSymSub6a)).toBeTruthy();
  expect(equals(diffSymSub6a, diffSymSub6aa)).toBeTruthy();
  expect(equals(diffSymSub6a, diffSymSub7)).toBeFalsy();
  expect(equals(diffSymSub6a, sym6)).toBeFalsy();
  expect(equals(sym6, diffSymSub6a)).toBeFalsy();
})

test('equating wrapped bigints', () => {
  // Wrapped BigInts
  const bigint = 10n;
  expect(Object(bigint).valueOf() === bigint).toBeTruthy();
  expect(equals(bigint, Object(bigint))).toBeTruthy();
  expect(equals(Object(bigint), bigint)).toBeTruthy();
  expect(equals(Object(bigint), Object(bigint))).toBeTruthy();

  const bigint1 = 1n;
  const bigint2 = 1n;
  const bigint3 = 2n;
  expect(equals(bigint1, Object(bigint2))).toBeTruthy();
  expect(equals(Object(bigint2), bigint1)).toBeTruthy();
  expect(equals(Object(bigint1), Object(bigint2))).toBeTruthy();
  expect(equals(Object(bigint1), Object(bigint3))).toBeFalsy();

  // BigInt Subclass
  const WrappedBigIntProto = Object.getPrototypeOf(Object(0n));

  const SubBigIntProto = Object.create(WrappedBigIntProto, {
    valueOf: {
      value: function() { return this.bigint }
    },
    bigint: {
      value: 0n
    }
  });

  function SubBigInt(bigint: BigInt) {
    return Object.create(SubBigIntProto, {
      bigint: {
        value: bigint
      }
    });
  }

  const bigintSub1 = SubBigInt(10n);
  const bigintSub2 = SubBigInt(10n);
  const bigintSub3 = SubBigInt(11n);
  expect(bigintSub1 instanceof BigInt).toBeTruthy();
  expect(bigintSub1.valueOf() === 10n).toBeTruthy();
  expect(isWrappedPrimSubtype(bigintSub1)).toBeTruthy();
  expect(equals(bigintSub1, bigintSub1)).toBeTruthy();
  expect(equals(bigintSub1, bigintSub2)).toBeTruthy();
  expect(equals(bigintSub1, bigintSub3)).toBeFalsy();
  expect(equals(bigintSub1, 10n)).toBeFalsy();
  expect(equals(10n, bigintSub1)).toBeFalsy();

  // BigInt Subclass with Different Equals Semantics
  function DiffBigIntSub(bigint: BigInt, field: string) {
    return Object.create(SubBigIntProto, {
      bigint: {
        value: bigint
      },
      field: {
        value: field
      }
    });
  }

  const diffBigIntSub4a = DiffBigIntSub(20n, 'a');
  const diffBigIntSub4b = DiffBigIntSub(20n, 'a');
  const diffBigIntSub5 = DiffBigIntSub(21n, 'b');
  expect(diffBigIntSub4a instanceof BigInt).toBeTruthy();
  expect(diffBigIntSub4a.valueOf() === 20n).toBeTruthy();
  expect(isWrappedPrimSubtype(diffBigIntSub4a)).toBeTruthy();
  expect(equals(diffBigIntSub4a, diffBigIntSub4a)).toBeTruthy();
  expect(equals(diffBigIntSub4a, diffBigIntSub4b)).toBeTruthy();
  expect(equals(diffBigIntSub4a, diffBigIntSub5)).toBeFalsy();
  expect(equals(diffBigIntSub4a, 20n)).toBeFalsy();
  expect(equals(20n, diffBigIntSub4a)).toBeFalsy();
})
