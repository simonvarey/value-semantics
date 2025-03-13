import { expect, test } from 'vitest'
import { ERROR_MSGS } from '../lib/common'

// * Primitives *

test('every error message can only have at most one %', () => {
  const noMultiPercent = Object.values(ERROR_MSGS).every((msg) => {
    return [...msg.matchAll(/%/g)].length < 2;
  });
  expect(noMultiPercent).toBeTruthy;
})
