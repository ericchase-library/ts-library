import { HandlerCaller } from '../Design Pattern/Handler.js';
import { SplitLines } from './String.js';

class CMenu {
  id;
  description;
  items;
}

class CMenuItem {
  id;
  description;
  action;
}
export function IsMenu(item) {
  return 'name' in item && 'items' in item && 'action' in item === false;
}
export function IsMenuItem(item) {
  return 'name' in item && IsMenu(item) === false && 'label' in item === false;
}

export class MenuNavigator {
  $open_handlers = new HandlerCaller();
  $select_handlers = new HandlerCaller();
  $stack;
  constructor(menu) {
    this.$stack = [menu];
  }
  get path() {
    return this.$stack.map((menu) => menu.name);
  }
  get current() {
    return this.$stack[this.$stack.length - 1];
  }
  async close() {
    if (this.$stack.length > 1) {
      this.$stack.pop();
      await this.$open_handlers.call({ menu: this.current, path: this.path });
    }
  }
  on(event, handler) {
    switch (event) {
      case 'open': {
        const remove = this.$open_handlers.add(handler);
        handler({ menu: this.current, path: this.path });
        return remove;
      }
      case 'select':
        return this.$select_handlers.add(handler);
    }
  }
  open = this.select;
  remove(event, handler) {
    switch (event) {
      case 'open':
        this.$open_handlers.remove(handler);
        break;
      case 'select':
        this.$select_handlers.remove(handler);
        break;
    }
  }
  async select(itemname) {
    for (const item of this.current.items ?? []) {
      if (item.name === itemname) {
        if (IsMenu(item)) {
          this.$stack.push(item);
          await this.$open_handlers.call({ menu: item, path: this.path });
        } else {
          await item.action?.({ item, path: this.path });
          await this.$select_handlers.call({ item, path: this.path });
        }
        return;
      }
    }
    throw new Error(`"${itemname}" does not exist in ${this.path.join(' > ')}`);
  }
}
export function ParseMenu(menu) {
  const item_names = menu?.items?.map((item) => item.name) ?? [];
  const item_count = item_names.length;
  const label = menu?.label?.trim() ?? '';
  const label_lines = label.length > 0 ? SplitLines(label) : [];
  const lines = [...label_lines, ...item_names];
  const line_count = lines.length;
  return { item_count, item_names, label_lines, label, line_count, lines };
}
