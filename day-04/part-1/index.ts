import * as assert from 'assert'
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
const draws: Uint8Array = Uint8Array.from(drawList) // Convert to TypedArray for performance.
const NUM_VALUES = draws.length

const boardStrings = input.substring(boardStartIdx).split('\n\n').map(trim).filter(isNotEmpty)
const boards: number[][][] = boardStrings.map((board) => {
    const rowStrings = board.split('\n')
    const rows = rowStrings.map((row) => row.split(' ').map(trim).filter(isNotEmpty).map(Number))
    return rows
})
const BOARD_SIZE = boards[0].length

// `draws` will eventually call every number from 0 - N, where N is the highest number.
const N = draws.length

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

// Play the game.
type Winner = { playerId: number; winPaths: number[] }
let winners: Winner[] = []
let calledNumbers: number[] = []
let latestDraw: number
for (const i in draws) {
    latestDraw = draws[i]
    calledNumbers.push(latestDraw)
    // Allot points for that number we called.
    const pointAwards = values[latestDraw]
    for (const [playerId, ...awardTypes] of pointAwards) {
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
            winners.push({ playerId, winPaths })
        }
    }
    if (winners.length > 0) {
        assert.strictEqual(winners.length, 1, `Problem claimed 1 winner, but there were ${winners.length}: ${winners}`)
        break
    }
}

// Now that we've determined the winner, calculate their score.
const calledNumbersMap = toBooleanMap(calledNumbers)
const winnerBoard: number[][] = boards[winners[0].playerId]
const winnerBoardFlat: number[] = flatten(winnerBoard)
let unmarkedSum: number = 0
for (const num of winnerBoardFlat) {
    if (calledNumbersMap[num] !== true) {
        unmarkedSum += num
    }
}

// ————

const solution = unmarkedSum * latestDraw
// console.log({ winner: winners[0], calledNumbers, winnerBoard, unmarkedSum, latestDraw, solution })

// === Write ===
if (require.main === module) {
    write(resolve(__dirname, OUTPUT_FILEPATH), String(solution), 'utf8')
    console.log('Completed.')
}
