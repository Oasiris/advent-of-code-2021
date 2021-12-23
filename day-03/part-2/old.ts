import * as fs from 'fs'
import * as path from 'path'
import { trim, isNotEmpty } from '../../lib/stringUtil'
import fill from 'lodash/fp/fill'
import range from 'lodash/fp/range'

// ——————————

import { IO as GenericIO } from '../../lib/models'
type IO = GenericIO<string, string>

// const INPUT_FILEPATH = '../in.txt'
const INPUT_FILEPATH = '../in-qviper.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ——————————

function main({ inputPath, outputPath }: IO): void {
    // === Read ===
    const file: string = fs.readFileSync(inputPath, 'utf8')
    const lines: string[] = file.split('\n').map(trim).filter(isNotEmpty)

    // === Algorithm ===
    // Don't proceed unless there are lines to parse.
    if (lines.length === 0) {
        throw Error(`Input had no lines.`)
    }
    const NUM_BITS: number = lines[0].length
    /** Each bucket is positive if that bit's most common value is 1, negative if 0. */
    let gammaBuckets: number[] = fill(0, NUM_BITS, 0, Array(NUM_BITS))
    const BITS_RANGE: number[] = range(0, NUM_BITS)

    for (const line of lines) {
        for (const i of BITS_RANGE) {
            // If a bucket has more 1s than 0s, it will be positive. Otherwise, negative.
            if (line[i] === '1') {
                gammaBuckets[i] += 1
            } else {
                gammaBuckets[i] -= 1
            }
        }
    }

    // Now, we need to figure out the most common & least common numbers, gamma & epsilon.
    // We'll get them as binary # representations, formatted as strings.
    let gammaChars: string[] = []
    let epsilonChars: string[] = []
    for (const i of BITS_RANGE) {
        const gammaBit = gammaBuckets[i] >= 0 ? 1 : 0
        const epsilonBit = gammaBit == 1 ? 0 : 1
        gammaChars.push(String(gammaBit))
        epsilonChars.push(String(epsilonBit))
    }
    const gammaString: string = gammaChars.join('')
    const epsilonString: string = epsilonChars.join('')
    const gamma = parseInt(gammaString, 2)
    const epsilon = parseInt(epsilonString, 2)

    // The n'th element of gammaMatchLevels contains a list of indices for all
    // binary numbers that match the first n characters of gamma.
    const gammaMatchBuckets: number[][] = Array(NUM_BITS)
        .fill(null)
        .map((val) => [])
    const epsilonMatchBuckets: number[][] = Array(NUM_BITS)
        .fill(null)
        .map((val) => [])
    lines.forEach((line, i) => {
        // Gamma loop:
        for (const n of BITS_RANGE) {
            // Keep going until the corresponding bits mismatch.
            if (line[n] !== gammaString[n]) {
                gammaMatchBuckets[n].push(i)
                break
            }
            if (line === gammaString) {
                gammaMatchBuckets[line.length - 1].push(i)
                break
            }
        }
        // Epsilon loop:
        for (const n of BITS_RANGE) {
            // Keep going until the corresponding bits mismatch.
            if (line[n] !== epsilonString[n]) {
                epsilonMatchBuckets[n].push(i)
                break
            }
            if (line === epsilonString) {
                epsilonMatchBuckets[line.length - 1].push(i)
                break
            }
        }
    })
    console.log({ gammaBuckets, gammaString, epsilonString })

    // Figure out which match bucket has exactly one element each.
    const gammaSearch = gammaMatchBuckets.filter((bucket) => bucket.length === 1)
    if (gammaSearch.length === 0) {
        throw Error(`Couldn't narrow down bit-matching for gamma (${gammaString}) to just 1 number`)
    }
    const epsilonSearch = epsilonMatchBuckets.filter((bucket) => bucket.length === 1)
    if (epsilonSearch.length === 0) {
        console.log(gammaMatchBuckets)
        console.log(epsilonMatchBuckets)
        throw Error(`Couldn't narrow down bit-matching for epsilon (${epsilonString}) to just 1 number`)
    }
    const gammaMatchIdx = gammaSearch[gammaSearch.length - 1][0]
    const gammaMatchStr: string = lines[gammaMatchIdx]
    const gammaMatch = parseInt(gammaMatchStr, 2)
    const epsilonMatchIdx = epsilonSearch[epsilonSearch.length - 1][0]
    const epsilonMatchStr: string = lines[epsilonMatchIdx]
    const epsilonMatch = parseInt(epsilonMatchStr, 2)

    // Get the product, or life support rating.
    const solution = gammaMatch * epsilonMatch
    console.log(gammaMatchBuckets)
    console.log(epsilonMatchBuckets)
    console.log({
        gammaSearch,
        gammaString,
        gamma,
        gammaMatchStr,
        gammaMatch,
        epsilonSearch,
        epsilonString,
        epsilon,
        epsilonMatchStr,
        epsilonMatch,
        solution,
    })

    // === Write ===
    fs.writeFileSync(outputPath, String(solution), 'utf8')
}

// ——————————

if (require.main === module) {
    main({
        inputPath: path.resolve(__dirname, INPUT_FILEPATH),
        outputPath: path.resolve(__dirname, OUTPUT_FILEPATH),
    })
    console.log('Complete.')
}
