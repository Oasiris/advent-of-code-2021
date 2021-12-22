import * as fs from 'fs'
import * as path from 'path'
import range from 'lodash/range'
import { trim, isNotEmpty } from '../../lib/stringUtil'

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
    const lines: string[] = file.split('\n')
    // .map(trim)
    // .filter(isNotEmpty)
    // .map((line: string) => line.split(' '))
    // .map(([left, right]: [string, string]) => [left, Number(right)])

    // === Algorithm ===
    let depth: number = 0
    let horizontalPosition: number = 0
    for (let line of lines) {
        line = trim(line)
        if (!exists(line) || !isNotEmpty(line)) {
            continue
        }
        const [commandName, value]: string[] = line.split(' ')
        switch (commandName) {
            case 'forward':
                horizontalPosition += Number(value)
                break
            case 'down':
                depth += Number(value)
                break
            case 'up':
                depth -= Number(value)
                break
            default:
                throw Error(`Couldn't understand instruction '${commandName}'`)
        }
    }
    const product = depth * horizontalPosition

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
