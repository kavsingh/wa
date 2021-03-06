import { curry, isNil, has, __, omit } from 'ramda'

export const isNotNil = <T>(value: T): value is NonNullable<T> => !isNil(value)

/**
 * Returns new object if there are items to be removed, otherwise
 * returns original object
 */
export const stableOmit: {
  <T, K extends keyof T>(keys: K[], obj: T): Omit<T, K>
  <K extends string>(keys: K[]): <T>(obj: T) => Omit<T, K>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = curry((keys: string[], obj: any) =>
  keys.some(has(__, obj)) ? omit(keys, obj) : obj,
)
