import * as fs from 'fs'
import * as path from 'path'
import range from 'lodash/range'
import { trim, isNotEmpty } from '../../lib/stringUtil'

// ———————————————————

import { IO as GenericIO } from '../../lib/models'
type IO = GenericIO<string, string>

const INPUT_FILEPATH = '../in.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ———————————————————

function main({ inputPath, outputPath }: IO): void {
    // === Read ===
    const file: string = fs.readFileSync(inputPath, 'utf8')
    // Parse the file.
    const depthValues: number[] = file.split('\n').map(trim).filter(isNotEmpty).map(Number)

    // === Algorithm ===
    const LEN = depthValues.length
    const WINDOW_SIZE = 3

    let prevSum: number
    let currSum: number = 0
    for (const i of range(0, WINDOW_SIZE)) {
        currSum += depthValues[i]
    }

    /** Start where the window is full. */
    const startIdx = WINDOW_SIZE
    /** End where the window is full. */
    const endIdx = LEN
    let increaseCount: number = 0
    for (const i of range(startIdx, endIdx)) {
        prevSum = currSum
        currSum = prevSum + depthValues[i] - depthValues[Number(i) - WINDOW_SIZE]
        // Keep count of how many times adjacent depth windows increase.
        if (currSum > prevSum) {
            increaseCount++
        }
    }

    // === Write ===
    fs.writeFileSync(outputPath, String(increaseCount), 'utf8')
}

// ———————————————————

if (require.main === module) {
    main({
        inputPath: path.resolve(__dirname, INPUT_FILEPATH),
        outputPath: path.resolve(__dirname, OUTPUT_FILEPATH),
    })
    console.log('Complete.')
}
