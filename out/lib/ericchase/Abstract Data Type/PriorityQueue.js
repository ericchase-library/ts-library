import { BinaryHeap } from "../Data Structure/BinaryHeap.js";

export class PriorityQueue extends BinaryHeap {
  constructor(mustComeBefore = (a, b) => a < b) {
    super((a, b) => mustComeBefore(a, b) || !mustComeBefore(b, a) && this.getInsertOrder(a) < this.getInsertOrder(b));
  }
  insert(value) {
    this.setInsertOrder(value);
    super.insert(value);
  }
  getInsertOrder(value) {
    return this.insertOrderMap.get(value) ?? 0;
  }
  setInsertOrder(value) {
    this.insertOrderMap.set(value, this.insertOrderKey);
    this.insertOrderKey++;
  }
  insertOrderMap = new Map;
  insertOrderKey = 0;
}

export class MaxPriorityQueue extends PriorityQueue {
  constructor(mustComeBefore = (a, b) => a > b) {
    super(mustComeBefore);
  }
}

export class MinPriorityQueue extends PriorityQueue {
}
