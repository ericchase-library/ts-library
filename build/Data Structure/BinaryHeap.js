export class BinaryHeap {
  isOrdered;
  constructor(isOrdered = (a, b) => a < b) {
    this.isOrdered = isOrdered;
  }
  get length() {
    return this.heap.length;
  }
  get top() {
    if (this.heap.length === 0) {
      return;
    }
    return this.heap[0];
  }
  insert(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }
  remove() {
    const top = this.top;
    const bot = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bot;
      this.siftDown(0);
    }
    return top;
  }
  getLeftChildIndex(index) {
    return index * 2 + 1;
  }
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  getRightChildIndex(index) {
    return index * 2 + 2;
  }
  siftDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let orderedIndex = index;
    if (leftChildIndex < this.heap.length && this.isOrdered(this.heap[leftChildIndex], this.heap[orderedIndex])) {
      orderedIndex = leftChildIndex;
    }
    if (rightChildIndex < this.heap.length && this.isOrdered(this.heap[rightChildIndex], this.heap[orderedIndex])) {
      orderedIndex = rightChildIndex;
    }
    if (orderedIndex !== index) {
      this.swap(orderedIndex, index);
      this.siftDown(orderedIndex);
    }
  }
  siftUp(index) {
    if (index === 0) {
      return;
    }
    const parentIndex = this.getParentIndex(index);
    if (!this.isOrdered(this.heap[parentIndex], this.heap[index])) {
      this.swap(parentIndex, index);
      this.siftUp(parentIndex);
    }
  }
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  heap = [];
}

export class MaxBinaryHeap extends BinaryHeap {
  constructor(isOrdered = (a, b) => a < b) {
    super((a, b) => !isOrdered(a, b) && isOrdered(b, a));
  }
}

export class MinBinaryHeap extends BinaryHeap {}
