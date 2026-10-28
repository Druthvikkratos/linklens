export class DoublyLinkedListNode<K, V> {
  public key: K;
  public value: V;
  public next!: DoublyLinkedListNode<K, V>;
  public prev!: DoublyLinkedListNode<K, V>;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class DoublyLinkedList<K, V> {
  private head: DoublyLinkedListNode<K, V>;
  private tail: DoublyLinkedListNode<K, V>;
  private _size: number = 0;

  constructor() {
    // Sentinel nodes use placeholder key/value; these values are never read
    this.head = new DoublyLinkedListNode<K, V>(
      undefined as unknown as K,
      undefined as unknown as V,
    );
    this.tail = new DoublyLinkedListNode<K, V>(
      undefined as unknown as K,
      undefined as unknown as V,
    );
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public get size(): number {
    return this._size;
  }

  addFirst(node: DoublyLinkedListNode<K, V>): void {
    const oldFirst = this.head.next;
    node.next = oldFirst;
    node.prev = this.head;
    oldFirst.prev = node;
    this.head.next = node;
    this._size += 1;
  }

  toArray(): K[] {
    const keys: K[] = [];
    let current = this.head.next;
    while (current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }
    return keys;
  }

  removeLast(): DoublyLinkedListNode<K, V> | undefined {
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

  remove(node: DoublyLinkedListNode<K, V>): void {
    const prevNode = node.prev; //A
    const nextNode = node.next; // C
    if (prevNode === undefined || nextNode === undefined) {
      throw Error('Node not found');
    }
    if (prevNode === node || nextNode === node) {
      throw Error('Node is already removed');
    }
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
    node.prev = node;
    node.next = node;
    this._size -= 1;
  }

  moveToFront(node: DoublyLinkedListNode<K, V>): void {
    this.remove(node);
    this.addFirst(node);
  }
}
