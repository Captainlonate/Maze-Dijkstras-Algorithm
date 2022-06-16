/*
  The nodes used within a sorted (singly) linked list
*/
export class SortedLinkedListNode<T> {
  data: any;
  // Since data might contain anything (an object), the data field
  // cannot be used for sorting (comparing them). So instead, this field will
  // be explicitly set.
  comparableValue: number | string;
  // [node].next -> [node].next -> [node].next
  next: SortedLinkedListNode<T> | null;

  constructor (data: T, comparableValue: number | string) {
    this.data = data
    this.comparableValue = comparableValue
    this.next = null
  }
}

/*
  Contains a bunch of nodes for this sorted linked list,
  and has methods for adding new nodes to the correct
  spots.
  Supports "popping" nodes off the front of the list.
*/
export class SortedLinkedList<T> {
  private _firstNode: SortedLinkedListNode<T> | null;
  private _length: number;

  constructor () {
    this._firstNode = null
    this._length = 0
  }
  
  // ==================GETTERS & SETTERS================

  get isEmpty () {
    return !this._firstNode
  }

  get length () {
    return this._length
  }

  get firstElement (): T | null {
    return this._firstNode ? this._firstNode.data : null
  }
  
  // =======================METHODS=====================

  addAndSort (data: T, comparableValue: number | string) {
    // This node needs to be placed somewhere in the sorted list
    const newNode = new SortedLinkedListNode<T>(data, comparableValue)
    // If the list is empty, or if the new node needs to be
    // placed at the beginning
    if (!this._firstNode || comparableValue < this._firstNode.comparableValue) {
      newNode.next = this._firstNode
      this._firstNode = newNode
    } else {
      // Find the location in the linked list where this node should be inserted
      let currentNode: SortedLinkedListNode<T> | null = this._firstNode
      // Move through the linked list until I find a node whose
      // comparable value is less than my new node's.
      while (
        currentNode.next !== null &&
        currentNode.next.comparableValue < newNode.comparableValue
      ) {
        currentNode = currentNode.next;
      }
      // Insert the new node right after the one with a smaller value
      newNode.next = currentNode.next;
      currentNode.next = newNode;
    }
    this._length++
  }

  /*
    "pop" and element from the front of the list
    (Doesn't just return it, it removes it from the list)
  */
  getNext (): T | null {
    let data = null
    if (this._firstNode) {
      data = this._firstNode.data
      this._firstNode = this._firstNode.next
      this._length--
    }
    return data
  }

  clearAll () {
    this._firstNode = null
    this._length = 0
  }

  debug () {
    console.table(this.toArray())
  }

  toArray () {
    let currentNode = this._firstNode
    let listAsArray = []
    while (currentNode) {
      listAsArray.push({
        comparableValue: currentNode.comparableValue,
        data: currentNode.data
      })
      currentNode = currentNode.next
    }
    return listAsArray
  }
}