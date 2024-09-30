import { JSONGet } from '../src/Algorithm/JSON.js';
import { GlobScanner } from '../src/Platform/Bun/Glob.js';
import { Path } from '../src/Platform/Node/Path.js';
import { StdinRawModeReader } from '../src/Platform/Node/Process.js';
import { KEYS, Shell } from '../src/Platform/Node/Shell.js';
import { ConsoleLog } from '../src/Utility/Console.js';
import type { Menu } from '../src/Utility/Menu.js';
import { ShellMenu } from '../src/Utility/ShellMenu.js';

const menu_oldfile: Menu = {
  name: 'Main',
  label: 'OLD Exports File: (Space or Enter to select)',
  items: [],
};

const menu_newfile: Menu = {
  name: 'Main',
  label: 'NEW Exports File: (Space or Enter to select)',
  items: [],
};

let oldfile = '';
let newfile = '';

for (const path_group of new GlobScanner().scan(new Path(__dirname).join('./exports'), '*.json').path_groups) {
  menu_oldfile.items.push({
    name: path_group.base,
    action: () => {
      oldfile = path_group.path;
    },
  });
  menu_newfile.items.push({
    name: path_group.base,
    action: () => {
      newfile = path_group.path;
    },
  });
}

menu_oldfile.items.push({
  name: 'Quit',
  action: () => {
    process.exit();
  },
});

const menu = new ShellMenu({
  menu: menu_oldfile,
});

const stdin = new StdinRawModeReader();
stdin.addHandler((text) => {
  if (text === KEYS.SIGINT) {
    process.exit();
  }
});
await stdin.start();

stdin.addHandler(async (text) => {
  switch (text) {
    case KEYS.ARROWS.UP:
      menu.previousItem();
      break;
    case KEYS.ARROWS.DOWN:
      menu.nextItem();
      break;
    case ' ':
    case '\r':
    case '\n': {
      await menu.selectItem();
      switch (menu.menu) {
        case menu_oldfile:
          menu.swap({ menu: menu_newfile });
          break;
        case menu_newfile:
          menu.clear();
          await analyzeExports(oldfile, newfile);
          break;
      }
      break;
    }
    case KEYS.ESC:
      switch (menu.menu) {
        case menu_newfile:
          menu.swap({ menu: menu_oldfile });
          break;
      }
      break;
  }
});

Shell.HideCursor();

async function analyzeExports(oldpath: string, newpath: string) {
  const oldexports = JSON.parse(await Bun.file(oldpath).text());
  const newexports = JSON.parse(await Bun.file(newpath).text());

  const output: Record<string, any> = {};

  const keys = [...Object.keys(newexports), ...Object.keys(oldexports)].sort((a, b) => {
    const aPath = new Path(a);
    const bPath = new Path(b);
    const dirComp = aPath.dir.localeCompare(bPath.dir);
    if (dirComp !== 0) {
      return dirComp;
    }
    return aPath.base.localeCompare(bPath.base);
  });

  for (const key of keys) {
    const newSet = new Set(JSONGet(newexports, key) ?? []);
    const oldSet = new Set(JSONGet(oldexports, key) ?? []);
    const addSet = newSet.difference(oldSet);
    const removeSet = oldSet.difference(newSet);
    if (addSet.size > 0) {
      if (output[key] === undefined) output[key] = [];
      output[key].add = [...addSet].sort();
    }
    if (removeSet.size > 0) {
      if (output[key] === undefined) output[key] = [];
      output[key].remove = [...removeSet].sort();
    }
  }

  for (const key in output) {
    const name = key.replace(/\\/g, '/');
    if (output[key].add && output[key].remove) {
      ConsoleLog(`= ${name}`);
      for (const item of output[key].remove ?? []) {
        ConsoleLog(`  - ${item}`);
      }
      for (const item of output[key].add ?? []) {
        ConsoleLog(`  + ${item}`);
      }
    } else if (output[key].add) {
      ConsoleLog(`+ ${name}`);
      for (const item of output[key].add ?? []) {
        ConsoleLog(`  + ${item}`);
      }
    } else if (output[key].remove) {
      ConsoleLog(`- ${name}`);
      for (const item of output[key].remove ?? []) {
        ConsoleLog(`  - ${item}`);
      }
    }
    ConsoleLog();
  }
}
