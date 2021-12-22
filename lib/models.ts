export type FilepathType = string | string[]

/**
 * Struct representing an input and output file.
 */
export type IO<T extends FilepathType, U extends FilepathType> = {
    inputPath: T
    outputPath: U
}
