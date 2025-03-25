export class BinaryHeap {
  mustComeBefore;
  constructor(mustComeBefore = (a, b) => a < b) {
    this.mustComeBefore = mustComeBefore;
  }
  clear() {
    this.buffer.length = 0;
  }
  get size() {
    return this.buffer.length;
  }
  get top() {
    return this.buffer[0];
  }
  insert(value) {
    this.buffer.push(value);
    this.siftUp(this.buffer.length - 1);
  }
  pop() {
    const top = this.top;
    if (this.buffer.length > 1) {
      this.buffer[0] = this.buffer[this.buffer.length - 1];
      this.siftDown(0);
    }
    this.buffer.pop();
    return top;
  }
  toArray() {
    const temp = new BinaryHeap(this.mustComeBefore);
    temp.buffer = this.buffer.slice();
    const items = [];
    while (temp.size > 0) {
      items.push(temp.pop());
    }
    return items;
  }
  static GetLeftChildIndex(index) {
    return index * 2 + 1;
  }
  static GetParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  static GetRightChildIndex(index) {
    return index * 2 + 2;
  }
  static ToArray(heap) {
    const temp = new BinaryHeap(heap.mustComeBefore);
    temp.buffer = heap.buffer.slice();
    const items = [];
    while (temp.size > 0) {
      items.push(temp.pop());
    }
    return items;
  }
  siftDown(index) {
    const iL = BinaryHeap.GetLeftChildIndex(index);
    const iR = BinaryHeap.GetRightChildIndex(index);
    let orderedIndex = index;
    if (iL < this.buffer.length && this.mustComeBefore(this.buffer[iL], this.buffer[orderedIndex])) {
      orderedIndex = iL;
    }
    if (iR < this.buffer.length && this.mustComeBefore(this.buffer[iR], this.buffer[orderedIndex])) {
      orderedIndex = iR;
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
    const iP = BinaryHeap.GetParentIndex(index);
    if (!this.mustComeBefore(this.buffer[iP], this.buffer[index])) {
      this.swap(iP, index);
      this.siftUp(iP);
    }
  }
  swap(index1, index2) {
    [this.buffer[index1], this.buffer[index2]] = [this.buffer[index2], this.buffer[index1]];
  }
  buffer = [];
}

export class MaxBinaryHeap extends BinaryHeap {
  constructor(mustComeBefore = (a, b) => a > b) {
    super(mustComeBefore);
  }
}

export class MinBinaryHeap extends BinaryHeap {
}
