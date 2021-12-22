import * as fs from 'fs'
import * as path from 'path'

// ———————————————————

import { IO } from '../../lib/models'
type Day01_IO = IO<string, string>

const INPUT_FILEPATH = '../in.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ———————————————————

const trim = (s: string) => s.trim()
const isNotEmpty = (s: string) => s.length !== 0

function main({ inputPath, outputPath }: Day01_IO): void {
    // === Read ===
    const file: string = fs.readFileSync(inputPath, 'utf8')
    // Parse the file.
    const depthValues: number[] = file.split('\n').map(trim).filter(isNotEmpty).map(Number)

    // === Algorithm ===
    const len = depthValues.length
    let prev: number
    let curr: number = depthValues[0]
    let increaseCount: number = 0
    for (let i = 1; i < len; i++) {
        // Get the i'th and (i - 1)'th depth values.
        prev = curr
        curr = depthValues[i]
        // Keep count of how many times adjacent depth values increase.
        if (curr > prev) {
            increaseCount++
        }
    }

    // === Write ===
    fs.writeFileSync(outputPath, String(increaseCount), 'utf8')
}

// ———————————————————

// Reference: https://stackoverflow.com/questions/4981891
if (require.main === module) {
    main({
        inputPath: path.resolve(__dirname, INPUT_FILEPATH),
        outputPath: path.resolve(__dirname, OUTPUT_FILEPATH),
    })
    console.log('Complete.')
}
