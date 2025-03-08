interface Node<T> {
  item: T;
  downstream_set: Set<T>;
  upstream_count: number;
}

export class DependencyGraph<T> {
  $map: Map<T, Node<T>> = new Map();

  addNode(item: T): void {
    if (this.$map.has(item)) {
      throw new Error(`item "${item}" already added`);
    }
    this.$map.set(item, { item, downstream_set: new Set(), upstream_count: 0 });
  }

  removeNode(item: T): void {
    if (this.$map.has(item) === false) {
      throw new Error(`item "${item}" already removed`);
    }

    for (const [_, { downstream_set }] of this.$map) {
      downstream_set.delete(item);
    }
    this.$map.delete(item);
  }

  addEdge(item_upstream: T, item_downstream: T): void {
    if (item_upstream === item_downstream) {
      throw new Error(`item "${item_upstream}" may not depend on self`);
    }

    const node_upstream = this.$map.get(item_upstream);
    if (node_upstream === undefined) {
      throw new Error(`upstream item "${item_upstream}" does not exist. (downstream item "${item_downstream}")`);
    }

    const node_downstream = this.$map.get(item_downstream);
    if (node_downstream === undefined) {
      throw new Error(`downstream item "${item_downstream}" does not exist. (upstream item "${item_upstream}")`);
    }

    node_upstream.downstream_set.add(item_downstream);
    node_downstream.upstream_count += 1;
  }

  removeEdge(item_upstream: T, item_downstream: T): void {
    const node_upstream = this.$map.get(item_upstream);
    if (node_upstream === undefined) {
      throw new Error(`upstream item "${item_upstream}" does not exist. (downstream item "${item_downstream}")`);
    }

    if (node_upstream.downstream_set.has(item_downstream) === false) {
      throw new Error(`no edge from upstream item "${item_upstream}" to downstream item "${item_downstream}"`);
    }

    const node_downstream = this.$map.get(item_downstream);
    if (node_downstream === undefined) {
      throw new Error(`downstream item "${item_downstream}" does not exist. (upstream item "${item_upstream}")`);
    }

    node_upstream.downstream_set.delete(item_downstream);
    node_downstream.upstream_count -= 1;
  }

  getTopologicalOrder(subset?: T[]): { cycle_nodes: T[]; has_cycle: boolean; ordered_nodes: T[] } {
    const map_copy = new Map(this.$map);
    const node_queue: Node<T>[] = [];

    if (subset === undefined || subset.length === 0) {
      for (const [item, { downstream_set, upstream_count }] of this.$map) {
        if (upstream_count === 0) {
          node_queue.push({ item, downstream_set, upstream_count });
        }
      }
    } else {
      for (const item of subset) {
        const { downstream_set, upstream_count } = this.$map.get(item) ?? {};
        if (downstream_set !== undefined && upstream_count !== undefined) {
          if (upstream_count === 0) {
            node_queue.push({ item, downstream_set, upstream_count });
          }
        }
      }
    }

    const ordered_nodes: T[] = [];

    let queue_start = 0;
    while (queue_start !== node_queue.length) {
      const node = node_queue[queue_start];
      queue_start += 1;
      ordered_nodes.push(node.item);

      for (const item_downstream of node.downstream_set) {
        const node_downstream = map_copy.get(item_downstream);
        if (node_downstream === undefined) {
          throw new Error(`downstream item "${item_downstream}" does not exist. (upstream item "${node.item}")`);
        }
        node_downstream.upstream_count -= 1;
        if (node_downstream.upstream_count < 0) {
          throw new Error(`downstream item "${item_downstream}" has negative upstream count. (upstream item "${node.item}")`);
        }
        if (node_downstream.upstream_count === 0) {
          node_queue.push(node_downstream);
        }
      }
    }

    const cycle_nodes = new Set<T>();
    for (const [item, { upstream_count }] of map_copy) {
      if (upstream_count > 0) {
        cycle_nodes.add(item);
      }
    }

    return { cycle_nodes: [...cycle_nodes], has_cycle: ordered_nodes.length !== this.$map.size, ordered_nodes };
  }

  getUpstreamSet(item_query: T): T[] {
    const upstream_set: T[] = [];
    for (const [item, { downstream_set }] of this.$map) {
      for (const item_downstream of downstream_set) {
        if (item_downstream === item_query) {
          upstream_set.push(item);
        }
      }
    }
    return upstream_set;
  }
}
