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

    // === Algorithm ===
    let aim: number = 0
    let depth: number = 0
    let horizontalPosition: number = 0
    for (let line of lines) {
        line = trim(line)
        if (!exists(line) || !isNotEmpty(line)) {
            continue
        }
        const [commandName, valueString]: string[] = line.split(' ')
        let value = Number(valueString)
        switch (commandName) {
            case 'down':
                aim += value
                break
            case 'up':
                aim -= value
                break
            case 'forward':
                horizontalPosition += value
                depth += aim * value
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
