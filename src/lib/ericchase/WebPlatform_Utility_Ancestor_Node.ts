/**
 * Creates a list of a Node's ancestors from the furthest to closest ancestor.
 */
export function WebPlatform_Utility_Get_Ancestor_List(node: Node): Node[] {
  const list: Node[] = [];
  let parent = node.parentNode;
  while (parent !== null) {
    list.push(parent);
    parent = parent.parentNode;
  }
  return list.toReversed();
}

/**
 * Finds the closest ancestor between all nodes provided.
 */
export function WebPlatform_Utility_Get_Closest_Common_Ancestor(...nodes: Node[]): Node | undefined {
  if (nodes.length > 0) {
    const ancestor_lists: Node[][] = [];
    for (const node of nodes) {
      ancestor_lists.push(WebPlatform_Utility_Get_Ancestor_List(node));
    }
    let inner_list_min_length = ancestor_lists[0].length;
    for (let i = 1; i < ancestor_lists.length; i++) {
      if (ancestor_lists[i].length < inner_list_min_length) {
        inner_list_min_length = ancestor_lists[i].length;
      }
    }
    let current_common_ancestor: Node | undefined = undefined;
    for (let inner_list_i = 0; inner_list_i < inner_list_min_length; inner_list_i++) {
      let is_common = true;
      for (let ancestor_lists_i = 1; ancestor_lists_i < ancestor_lists.length; ancestor_lists_i++) {
        if (ancestor_lists[0][inner_list_i] !== ancestor_lists[ancestor_lists_i][inner_list_i]) {
          is_common = false;
          break;
        }
      }
      if (is_common === true) {
        current_common_ancestor = ancestor_lists[0][inner_list_i];
      }
    }
    return current_common_ancestor;
  }
}
