import { DoublyLinkedList, DoublyLinkedListNode } from './doubly-linked-list';

describe('Doubly-Linked', () => {
  let list;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });
  it('should return the array size of one', () => {
    const node = new DoublyLinkedListNode<string, string>('A', 'Apple');
    list.addFirst(node);
    expect(list.size).toBe(1);
  });
  it('should return the array in the inserted order', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    expect(list.size).toBe(3);
    expect(list.toArray()).toEqual(['A', 'B', 'C']);
  });
  it('should remove the last node from array', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    const result = list.removeLast();
    expect(result).toEqual(nodec);
    expect(list.toArray()).toEqual(['A', 'B']);
    expect(list.size).toBe(2);
  });
  it('should show undefined if there is no nodes', () => {
    const result = list.removeLast();
    expect(result).toEqual(undefined);
    expect(list.size).toBe(0);
  });
  it('should remove the node B and adjust the size', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.remove(nodeb);
    expect(list.toArray()).toEqual(['A', 'C']);
    expect(list.size).toBe(2);
  });
  it('should remove the node A and adjust the size', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.remove(nodea);
    expect(list.toArray()).toEqual(['B', 'C']);
    expect(list.size).toBe(2);
  });
  it('should remove the last node and adjust the size', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.remove(nodec);
    expect(list.toArray()).toEqual(['A', 'B']);
    expect(list.size).toBe(2);
  });
  it('should move the last node to first', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.moveToFront(nodec);
    expect(list.toArray()).toEqual(['C', 'A', 'B']);
    expect(list.size).toBe(3);
  });
  it('should move the middle node to first', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.moveToFront(nodeb);
    expect(list.toArray()).toEqual(['B', 'A', 'C']);
    expect(list.size).toBe(3);
  });
  it('should the first node be same', () => {
    const nodec = new DoublyLinkedListNode<string, string>('C', 'Car');
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodec);
    list.addFirst(nodeb);
    list.addFirst(nodea);
    list.moveToFront(nodea);
    expect(list.toArray()).toEqual(['A', 'B', 'C']);
    expect(list.size).toBe(3);
  });
  it('should the list become empty after removing', () => {
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodea);
    list.remove(nodea);
    expect(list.toArray()).toEqual([]);
    expect(list.size).toBe(0);
    const result = list.removeLast();
    expect(result).toEqual(undefined);
  });
  it('should throw error if node is not available', () => {
    const nodeb = new DoublyLinkedListNode<string, string>('B', 'Ball');
    const nodea = new DoublyLinkedListNode<string, string>('A', 'Africa');
    list.addFirst(nodeb);
    list.addFirst(nodea);
    const nodex = new DoublyLinkedListNode<string, string>('X', 'x');
    expect(() => list.remove(nodex)).toThrow('Node not found');
    expect(list.toArray()).toEqual(['A', 'B']);
    expect(list.size).toBe(2);
  });
});
