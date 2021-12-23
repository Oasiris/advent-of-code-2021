import { readFileSync as read, writeFileSync as write } from 'fs'
import { resolve } from 'path'

import range from 'lodash/fp/range'

import { trim, isNotEmpty } from '../../lib/stringUtil'
import { argmin } from '../../lib/util'

const INPUT_FILEPATH: string = '../in.txt'
const OUTPUT_FILEPATH: string = 'out.txt'

// ————

// === Read ===
const input: string = read(resolve(__dirname, INPUT_FILEPATH), 'utf8')

// === Algorithm ===
const lines: string[] = input.split('\n').map(trim).filter(isNotEmpty)
const NUM_ITEMS: number = lines.length
const NUM_BITS: number = lines[0].length

// Parse to data.
let data: Uint8Array[] = []
for (const line of lines) {
    const numList: number[] = line.split('').map(Number)
    data.push(Uint8Array.from(numList))
}

// Get the transpose of data, a 2D matrix.
let dataT: Uint8Array[] = []
for (let __ in range(0, NUM_BITS)) {
    dataT.push(new Uint8Array(NUM_ITEMS))
}
for (const i in data) {
    for (const j in data[i]) {
        dataT[j][i] = data[i][j]
    }
}

/**
 * @param {boolean} useMinority Whether to yield the minority rule instead.
 * @returns The index of the input item who best follows "majority rule", in order of bits from
 *          left to right.
 */
function findMajorityRuleIdx(bitCriteria: 'majority' | 'minority'): number {
    /** List of indices for each contender. */
    let contenders: number[] = range(0, NUM_ITEMS)
    /** Left array contains indices of items whose n'th bit is 0. Right: 1. */
    let buckets: [number[], number[]]
    let solution: number
    for (const n of range(0, NUM_BITS)) {
        buckets = [[], []]
        const column: Uint8Array = dataT[n]
        for (const i of contenders) {
            // Get the nth bit of the item with index i.
            const bit = column[i] as 0 | 1
            buckets[bit].push(i)
        }
        let targetBit: number
        if (bitCriteria === 'minority') {
            // Minority rule should pick '0' in case of ties.
            targetBit = argmin(buckets.map((list) => list.length))
        } else {
            // Majority; pick the opposite value.
            targetBit = argmin(buckets.map((list) => list.length)) === 1 ? 0 : 1
        }
        contenders = buckets[targetBit]
        if (contenders.length === 1) {
            solution = contenders[0]
            break
        }
    }
    return solution
}

// Handle gamma (most-common) filtering.
const oxygenGeneratorIdx = findMajorityRuleIdx('majority')
const oxygenGeneratorRating: string = lines[oxygenGeneratorIdx]

// Handle epsilon (least-common) filtering.
const co2ScrubberIdx = findMajorityRuleIdx('minority')
const co2ScrubberRating: string = lines[co2ScrubberIdx]

// ————

const solution: number = parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2)

// === Write ===
if (require.main === module) {
    write(resolve(__dirname, OUTPUT_FILEPATH), String(solution), 'utf8')
    console.log('Completed.')
}
