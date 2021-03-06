import { createSelector } from 'reselect'

import { createValueEqSelector } from './selector'

describe('custom state selectors', () => {
  // Check assumptions for default createSelector
  describe('default createSelector assumptions check', () => {
    it('results in new value on ref changes despite equal values', () => {
      let state = { a: { b: [1, 2] } }
      const aSelector = (s: typeof state) => s.a

      const bSelector = createSelector(aSelector, (a) => a.b)
      const b = bSelector(state)

      expect(b).toEqual([1, 2])

      state = { a: { b: [1, 2] } }

      expect(bSelector(state)).not.toBe(b)
      expect(bSelector(state)).toEqual(b)
    })
  })

  describe('createValueEqSelector', () => {
    it('only results in new value if state value has changed', () => {
      let state = { a: { b: [1, 2] } }
      const aSelector = (s: typeof state) => s.a

      const bSelector = createValueEqSelector(aSelector, (a) => a.b)
      const b = bSelector(state)

      expect(b).toEqual([1, 2])

      state = { a: { b: [1, 2] } }

      expect(bSelector(state)).toBe(b)

      state = { a: { b: [2, 1] } }

      expect(bSelector(state)).not.toBe(b)
    })
  })
})
