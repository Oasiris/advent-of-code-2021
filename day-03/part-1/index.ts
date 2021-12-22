import * as fs from 'fs'
import * as path from 'path'
import { trim, isNotEmpty } from '../../lib/stringUtil'
import fill from 'lodash/fp/fill'
import range from 'lodash/fp/range'

// ——————————

import { IO as GenericIO } from '../../lib/models'
import { exists } from '../../lib/util'
type IO = GenericIO<string, string>

const INPUT_FILEPATH = '../in.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ——————————

function main({ inputPath, outputPath }: IO): void {
    // === Read ===
    const file: string = fs.readFileSync(inputPath, 'utf8')
    const lines: string[] = file.split('\n').map(trim).filter(isNotEmpty)

    // === Algorithm ===
    if (lines.length === 0) {
        throw Error(`Input had no lines.`)
    }
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
    // Return the product.
    const product = gamma * epsilon

    // === Write ===
    fs.writeFileSync(outputPath, String(product), 'utf8')
}

// ——————————

if (require.main === module) {
    main({
        inputPath: path.resolve(__dirname, INPUT_FILEPATH),
        outputPath: path.resolve(__dirname, OUTPUT_FILEPATH),
    })
    console.log('Complete.')
}
