import { error } from 'console';

export class DoublyLinkedListNode<K, V> {
  public key: K | undefined;
  public value: V | undefined;
  public next!: DoublyLinkedListNode<K, V>;
  public prev!: DoublyLinkedListNode<K, V>;

  constructor(key: K | undefined, value: V | undefined) {
    this.key = key;
    this.value = value;
  }
}

export class DoublyLinkedList<K, V> {
  private head!: DoublyLinkedListNode<K, V>;
  private tail!: DoublyLinkedListNode<K, V>;
  private _size: number = 0;

  constructor() {
    this.head = new DoublyLinkedListNode<K, V>(undefined, undefined);
    this.tail = new DoublyLinkedListNode<K, V>(undefined, undefined);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.head.prev = this.tail;
    this.tail.next = this.head;
  }

  public get size(): number {
    return this._size;
  }

  addFirst(node: DoublyLinkedListNode<K, V>) {
    const oldFirst = this.head.next;
    node.next = oldFirst;
    node.prev = this.head;
    oldFirst.prev = node;
    this.head.next = node;
    this._size += 1;
  }

  toArray() {
    let keys: K[] = [];
    let firstNode = this.head.next;
    while (firstNode != this.tail) {
      if (firstNode.key != undefined) {
        keys.push(firstNode.key);
      }
      firstNode = firstNode.next;
    }
    return keys;
  }

  removeLast() {
    if (this.tail.prev === this.head) {
      return undefined;
    }
    const lastNode = this.tail.prev;
    lastNode.prev.next = this.tail;
    this.tail.prev = lastNode.prev;
    this._size -= 1;
    lastNode.prev = lastNode;
    lastNode.next = lastNode;
    return lastNode;
  }

  remove(node: DoublyLinkedListNode<K, V>) {
    const prevNode = node.prev; //A
    const nextNode = node.next; // C
    if (prevNode === undefined || nextNode === undefined) {
      throw Error('Node not found');
    }
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
    node.prev = node;
    node.next = node;
    this._size -= 1;
  }

  moveToFront(node: DoublyLinkedListNode<K, V>) {
    this.remove(node);
    this.addFirst(node);
  }
}
