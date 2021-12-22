// ————————————
// General
// ————————————

/**
 * @returns Whether the given value is both defined and non-null.
 */
export function exists<T>(val: T): val is NonNullable<T> {
    return val !== undefined && val !== null
}
