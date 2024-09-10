import { BinaryHeap } from '../Data Structure/BinaryHeap.js';

class Keyed {
  key;
  data;
  constructor(key, data) {
    this.key = key;
    this.data = data;
  }
}

export class PriorityQueue {
  isOrdered;
  constructor(isOrdered = (a, b) => a < b) {
    this.isOrdered = isOrdered;
    this.queue = new BinaryHeap((a, b) => this.isOrdered(a.data, b.data) || (!this.isOrdered(b.data, a.data) && a.key < b.key));
  }
  get length() {
    return this.queue.length;
  }
  get top() {
    return this.queue.top?.data;
  }
  key = 0;
  insert(value) {
    this.queue.insert(new Keyed(this.key++, value));
  }
  remove() {
    return this.queue.remove()?.data;
  }
  queue;
}

export class MaxPriorityQueue extends PriorityQueue {
  constructor(isOrdered = (a, b) => a < b) {
    super((a, b) => !isOrdered(a, b) && isOrdered(b, a));
  }
}

export class MinPriorityQueue extends PriorityQueue {}
