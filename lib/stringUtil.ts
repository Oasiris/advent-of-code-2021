/**
 * @returns The input string, trimmed.
 */
export function trim(s: string): string {
    return s.trim()
}

/**
 * @returns Whether or not the input string has a non-zero length.
 */
export function isNotEmpty(s: string): boolean {
    return s.length !== 0
}
