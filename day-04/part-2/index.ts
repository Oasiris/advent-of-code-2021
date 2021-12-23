import { writeFileSync as write } from 'fs'
import { resolve } from 'path'

import { play, sumUnmarkedNumbers } from '../part-1'

const OUTPUT_FILEPATH = 'out.txt'

// ———

if (require.main === module) {
    // Simulate the game until all players win. Get the list of winners in sequential order.
    const { winners, calledNumbers, lastDraw } = play('untilAllWin')
    // Find unmarkedSum for the last player to win.
    const unmarkedSum = sumUnmarkedNumbers(winners[winners.length - 1].board, calledNumbers)

    const solution = unmarkedSum * lastDraw
    // console.log({ winners, calledNumbers, lastDraw })

    // === Write ===
    write(resolve(__dirname, OUTPUT_FILEPATH), String(solution), 'utf8')
    console.log('Completed.')
}
