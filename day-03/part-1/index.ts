import * as assert from 'assert'
import { readFileSync as read, writeFileSync as write } from 'fs'
import { resolve } from 'path'

import fill from 'lodash/fp/fill'
import range from 'lodash/fp/range'

import { trim, isNotEmpty } from '../../lib/stringUtil'

const INPUT_FILEPATH = '../in.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ————

// === Read ===
const input: string = read(resolve(__dirname, INPUT_FILEPATH), 'utf8')

// === Algorithm ===
const lines: string[] = input.split('\n').map(trim).filter(isNotEmpty)
assert.notStrictEqual(lines.length, 0, `Input had no lines.`)

const NUM_BITS: number = lines[0].length
/** Each bucket is positive if that bit's most common value is 1, negative if 0. */
let gammaBuckets: number[] = fill(0, NUM_BITS, 0, Array(NUM_BITS))

for (const line of lines) {
    for (const i of range(0, NUM_BITS)) {
        // If a bucket has more 1s than 0s, it will be positive. Otherwise, negative.
        if (line[i] === '1') {
            gammaBuckets[i] += 1
        } else {
            gammaBuckets[i] -= 1
        }
    }
}

/** Gamma: comprised of the most common value of each bit. */
let gamma: number = 0
/** Epsilon: comprised of the least common value of each bit. */
let epsilon: number = 0
// Prepare to loop from rightmost bit to leftmost bit, generating binary #s.
let coefficient: number = 1
const loopRange: number[] = range(0, NUM_BITS).reverse()
for (const i of loopRange) {
    // Generate both the gamma and epsilon numbers.
    const gammaBit = gammaBuckets[i] > 0 ? 1 : 0
    const epsilonBit = gammaBit == 1 ? 0 : 1
    gamma += coefficient * gammaBit
    epsilon += coefficient * epsilonBit
    coefficient *= 2
}

// ————

const product = gamma * epsilon

// === Write ===
if (require.main === module) {
    write(resolve(__dirname, OUTPUT_FILEPATH), String(product), 'utf8')
    console.log('Completed.')
}
