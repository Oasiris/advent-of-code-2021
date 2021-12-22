// /**
//  * Implementation for a double-ended queue.
//  */
// export class Deque<T> {
//     front: LinkedListNode<T> | undefined
//     back: LinkedListNode<T> | undefined
//     size: number

//     constructor() {
//         this.front = undefined
//         this.back = undefined
//         this.size = 0
//     }

//     addFront(value: T): void {
//         if (this.front === undefined) {
//             this.front = this.back = { value }
//         } else {
//             const newNode: LinkedListNode<T> = { value, prev: this.front }
//             this.front = newNode
//         }
//     }

//     append = this.addFront
//     push = this.addFront
// }

// /**
//  * Implementation for a linked list node.
//  * For internal use in the Deque only.
//  */
// type LinkedListNode<T> = {
//     value: T
//     prev?: LinkedListNode<T> | undefined
//     next?: LinkedListNode<T> | undefined
// }
