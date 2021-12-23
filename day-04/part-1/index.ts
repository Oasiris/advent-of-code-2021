import { readFileSync as read, writeFileSync as write } from 'fs'
import { resolve } from 'path'

import range from 'lodash/fp/range'
import flatten from 'lodash/fp/flatten'

import { isNotEmpty, trim } from '../../lib/stringUtil'
import { toBooleanMap } from '../../lib/util'

const INPUT_FILEPATH = '../in.txt'
const OUTPUT_FILEPATH = 'out.txt'

// ————

// === Read ===
const input: string = read(resolve(__dirname, INPUT_FILEPATH), 'utf8')

// === Solve ===
// Parse input.
const boardStartIdx = input.indexOf('\n\n')
const drawList: number[] = input.substring(0, boardStartIdx).trim().split(',').map(Number)
const draws: Uint8Array = Uint8Array.from(drawList) // TypedArrays are more performant.
// `draws` will eventually call every number from 0 - N, where N is the highest number.
const NUM_VALUES = draws.length

const boardStrings = input.substring(boardStartIdx).split('\n\n').map(trim).filter(isNotEmpty)
const boards: number[][][] = boardStrings.map((board) => {
    const rowStrings = board.split('\n')
    const rows = rowStrings.map((row) => row.split(' ').map(trim).filter(isNotEmpty).map(Number))
    return rows
})
const NUM_PLAYERS = boards.length
const BOARD_SIZE = boards[0].length

// Prepare player scoreboard.
const WIN_PATHS = ['c0', 'c1', 'c2', 'c3', 'c4', 'r0', 'r1', 'r2', 'r3', 'r4']
const NUM_WIN_PATHS = WIN_PATHS.length

type Player = { playerId: number; scores: number[] }
let players: Player[] = []
for (let playerId in boards) {
    const scores = Array(NUM_WIN_PATHS).fill(0)
    players.push({ playerId: Number(playerId), scores })
}

// Prepare radix buckets that lead from values to players.
let values: [number, number, number][][] = []
for (const __ of range(0, NUM_VALUES)) {
    values.push([])
}

// Loop through every player's board and populate radix buckets.
for (const playerId in boards) {
    const board = boards[playerId]
    for (const i in board) {
        for (const j in board[i]) {
            const value = board[i][j]
            const colWinMethod: number = Number(j)
            const rowWinMethod: number = 5 + Number(i)
            values[value].push([Number(playerId), colWinMethod, rowWinMethod])
        }
    }
}

export type Winner = { playerId: number; board: number[][]; winPaths: number[] }

/**
 * Play the game.
 */
export function play(until: 'untilFirstWin' | 'untilAllWin'): {
    winners: Winner[]
    calledNumbers: number[]
    lastDraw: number
} {
    let winners: Winner[] = []
    let playerWinStatus: boolean[] = Array(NUM_PLAYERS).fill(false)
    let calledNumbers: number[] = []
    let latestDraw: number
    for (const i in draws) {
        latestDraw = draws[i]
        calledNumbers.push(latestDraw)
        // Allot points for that number we called.
        const pointAwards = values[latestDraw]
        for (const [playerId, ...awardTypes] of pointAwards) {
            if (playerWinStatus[playerId] === true) {
                continue // Ignore players that already won.
            }
            // For each player, determine in which rows and columns they won a point.
            const scores = players[playerId].scores
            const winPaths: number[] = []
            for (const winPath of awardTypes) {
                scores[winPath] += 1
                // 5 in a row is bingo.
                if (scores[winPath] >= BOARD_SIZE) {
                    winPaths.push(winPath)
                }
            }
            if (winPaths.length > 0) {
                winners.push({ playerId, winPaths, board: boards[playerId] })
                playerWinStatus[playerId] = true
            }
        }
        if (winners.length > 0 && until === 'untilFirstWin') {
            break
        } else if (winners.length === NUM_PLAYERS && until === 'untilAllWin') {
            break
        }
    }
    return { winners, calledNumbers, lastDraw: latestDraw }
}

// Now that we've determined the winner, calculate their score.
/**
 * @returns The sum of all numbers on the board that weren't called.
 */
export function sumUnmarkedNumbers(board: number[][], calledNumbers: number[]): number {
    let unmarkedSum: number = 0
    const calledNumbersMap = toBooleanMap(calledNumbers)
    const boardFlat: number[] = flatten(board)
    for (const num of boardFlat) {
        if (calledNumbersMap[num] !== true) {
            unmarkedSum += num
        }
    }
    return unmarkedSum
}

// ————

if (require.main === module) {
    // Simulate the game until the first player wins.
    const { winners, calledNumbers, lastDraw } = play('untilFirstWin')
    const unmarkedSum = sumUnmarkedNumbers(winners[0].board, calledNumbers)

    const solution = unmarkedSum * lastDraw
    // console.log({ winner: winners[0], winningBoard: winners[0].board, calledNumbers, unmarkedSum, lastDraw, solution })

    // === Write ===
    write(resolve(__dirname, OUTPUT_FILEPATH), String(solution), 'utf8')
    console.log('Completed.')
}
